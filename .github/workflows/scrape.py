from requests import session
from bs4 import BeautifulSoup
from pypdf import PdfReader, PdfWriter
from os import environ, path
import fitz
import json

if path.isfile("localenv.py"):
    from localenv import localenv

    username = localenv()[0]
    password = localenv()[1]
else:
    username = environ.get("USERNAME")
    password = environ.get("PASSWORD")


def get_full_plan() -> None:
    """
    Function to retrieve the full plan, including login process and downloading the plan PDF.
    This function does not take any parameters and does not return anything.
    Returns:
        None
    """
    login_page = "https://cas.p.lodz.pl/cas/login?service=https%3A%2F%2Fweeia.edu.p.lodz.pl%2Flogin%2Findex.php%3FauthCAS%3DCAS"
    plan_page = "https://weeia.edu.p.lodz.pl/mod/resource/view.php?id=63920"

    with session() as s:
        req = s.get(login_page).text
        html = BeautifulSoup(req, "html.parser")
        lt = html.find("input", {"name": "lt"}).attrs["value"]
        event_id = html.find("input", {"name": "_eventId"}).attrs["value"]
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36",
            "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
        }
        payload = {
            "username": username,
            "password": password,
            "lt": lt,
            "_eventId": event_id,
        }
    s.post(
        login_page,
        data=payload,
        headers=headers,
    )
    r = s.get(plan_page)
    open("plan.pdf", "wb").write(r.content)
    # print("Waga pdf:", round(stat("plan.pdf").st_size / 1024, 1), "kB")
    # print("Liczba stron:", len(PdfReader("plan.pdf").pages))


def get_plan_page(word: str) -> None:
    """
    Extracts the page containing the specified word from the 'plan.pdf' and saves it to 'plan{word}.pdf'
    Args:
        word (str): Faculty name
    Returns:
        None
    """
    pdf_reader = PdfReader("plan.pdf")
    pdf_writer = PdfWriter()
    pages = pdf_reader.pages
    for page_nr, pg in enumerate(pages):
        if word in pg.extract_text():
            pdf_writer.add_page(pdf_reader.pages[page_nr])
            with open(f"plan{word}.pdf", "wb") as f:
                pdf_writer.write(f)
            break


def scrape_pdf_data(word: str) -> None:
    """
    Retrieves data from a PDF file containing a weekly schedule and saves it as a JSON file.
    Args:
        word (str): Faculty name
    Returns:
        None
    """
    weekdays_list = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"]
    hours_list = [
        "8:15",
        "9:15",
        "10:15",
        "11:15",
        "12:15",
        "13:15",
        "14:15",
        "15:15",
        "16:15",
        "17:15",
        "18:15",
        "19:15",
    ]
    page = fitz.open(f"plan{word}.pdf")[0]
    day_y_pos = [page.search_for(day)[0][2] for day in weekdays_list]
    hour_x_pos = [page.search_for(hour)[0][3] for hour in hours_list]
    data_dict = {
        "Day": "",
        "Start": "",
        "End": "",
        "SubjectName": "",
        "Class": "",
        "Days": "",
        "ClassType": "",
        "AdditionalData": "",
        "Teacher": [],
    }
    dict_list = []
    for draw in page.get_drawings():
        for item in draw["items"]:
            if item[0] == "re" and draw["color"] is not None:
                page.set_cropbox(
                    fitz.Rect(
                        x0=draw["rect"][0],
                        y0=draw["rect"][1],
                        x1=draw["rect"][2],
                        y1=draw["rect"][3],
                    )
                )
                for i, limit in enumerate(day_y_pos):
                    if draw["rect"][0] <= limit:
                        data_dict["Day"] = i
                        break
                for i, limit in enumerate(hour_x_pos):
                    if draw["rect"][3] >= limit:
                        data_dict["Start"] = i
                        data_dict["End"] = int(
                            i + round((draw["rect"][3] - draw["rect"][1]) / 63, 0)
                        )
                        break

                subject_name = ""
                day = []
                teachers = ""
                for elem in page.get_textpage().extractDICT()["blocks"]:
                    for el in elem["lines"]:
                        if el["spans"][0]["flags"] == 4:
                            for els in el["spans"]:
                                if els["bbox"][3] - els["bbox"][1] < 15:
                                    subject_name += els["text"]
                                else:
                                    subject_name += " " + els["text"]
                        if el["spans"][0]["flags"] == 20:
                            for els in el["spans"]:
                                day.append(els["text"])
                        if el["spans"][0]["flags"] == 6:
                            for els in el["spans"]:
                                if els["bbox"][3] - els["bbox"][1] < 10:
                                    teachers += els["text"]
                                else:
                                    teachers += " " + els["text"]
                additional_data = teachers.split(")")[-1].strip()
                if additional_data != "":
                    data_dict["AdditionalData"] = additional_data
                else:
                    data_dict["AdditionalData"] = None
                teacher_data = []
                for teacher in teachers.split(")")[:-1]:
                    if "dr" in teacher:
                        teacher = teacher.replace("dr", "Dr")
                    if "mgr" in teacher:
                        teacher = teacher.replace("mgr", "Mgr")
                    teacher_data.append(teacher.strip(",").strip() + ")")
                data_dict["Teacher"] = teacher_data
                data_dict["SubjectName"] = subject_name.strip()
                temp = day[-0].split(",")
                if len(temp) > 1:
                    temp = day[-0].split(",")
                    data_dict["Days"] = temp[1].strip()
                    data_dict["ClassType"] = temp[0].strip(".").strip()
                    data_dict["Class"] = day[-1].strip()
                elif len(temp) == 1:
                    data_dict["Days"] = temp[0].strip()
                    data_dict["ClassType"] = None
                    data_dict["Class"] = None
                dict_list.append(data_dict.copy())
    json.dump(dict_list, open(f"plan{word}.json", "w"), indent=4)


if __name__ == "__main__":
    faculty = "6AiSR4"
    get_full_plan()
    get_plan_page(faculty)
    scrape_pdf_data(faculty)
