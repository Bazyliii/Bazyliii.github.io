import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader, PdfWriter
from os import stat, environ, path
from pdfquery import PDFQuery

if path.isfile("localenv.py"):
    from localenv import localenv
    import pprint

    pp = pprint.PrettyPrinter(indent=2, width=160)
    username = localenv()[0]
    password = localenv()[1]
else:
    username = environ.get("USERNAME")
    password = environ.get("PASSWORD")

"""
def convert_pdf_to_xml():
    reader = PdfReader("planPage.pdf")
    box = reader.pages[0].mediabox
    print(box)
    pdf = pdfquery.PDFQuery("planPage.pdf")
    pdf.load()
    pdf.tree.write("plan.xml", pretty_print=True)
    with open("plan.xml", "r") as f:
        pdf = f.read()
    soup = BeautifulSoup(pdf, "xml")
    ltrect = soup.find_all("LTRect")
    for elem in ltrect:
        data = []
        for p in elem.find_all("LTTextLineHorizontal"):
            if p.get("height") == "8.76":
                if p.get_text() != "":
                    data.append(p.get_text())
                if float(p.get("width")) < 16 and p.get_text() != "":
                    data[len(data) - 2] = data[len(data) - 2][:-1]
        if len(data) > 0:
            print("".join(data))

    ltline = soup.find_all("LTLine")
    weekdays_limits = []
    for elem in ltline:
        if "5.631" in elem.get("bbox"):
            bbox = elem.get("bbox").strip("][").split(", ")
            # width = round(float(bbox[2]) - float(bbox[0]), 3)
            # height = round(float(bbox[3]) - float(bbox[1]), 3)
            top = round(box.height - 306.76 - float(bbox[3]), 3)
            # left = round(float(bbox[0]) - 45.231, 3)
            if top > 0:
                weekdays_limits.append(top)
    weekdays_limits.pop()
    print(weekdays_limits)
    temp = []
    remv = []
    remvvv = []
    wd = []
    hours = [
        "8:15",
        "9:00",
        "9:15",
        "10:00",
        "10:15",
        "11:00",
        "11:15",
        "12:00",
        "12:15",
        "13:00",
        "13:15",
        "14:00",
        "14:15",
        "15:00",
        "15:15",
        "16:00",
        "16:15",
        "17:00",
        "17:15",
        "18:00",
        "18:15",
        "19:00",
        "19:15",
        "20:00",
    ]
    for elem in ltrect:
        # x0, y0, x1, y1
        bboxint = elem.get("bbox")
        textt = elem.get_text()
        text = textt.replace("\n", "")
        temp.append(textt)
        bbox = bboxint.strip("][").split(", ")
        # if (round(float(bbox[3]) - float(bbox[1]), 3)) == 78.48:
        #    remvvv.append(text)
        if (round(float(bbox[3]) - float(bbox[1]), 3)) == 9.12 or (
            round(float(bbox[3]) - float(bbox[1]), 3)
        ) == 7.429:
            remvvv.append(text)
        if (round(float(bbox[3]) - float(bbox[1]), 3)) <= 12:
            remv.append(text)
        if text != "" and (float(bbox[3]) - float(bbox[1])) > 12:
            width = round(float(bbox[2]) - float(bbox[0]), 3)
            height = round(float(bbox[3]) - float(bbox[1]), 3)
            top = round(box.height - 306.76 - float(bbox[3]), 3)
            left = round(float(bbox[0]) - 45.231, 3)
            days = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek"]
            for i in range(len(weekdays_limits)):
                if weekdays_limits[i] > top:
                    wd.append(days[i])
                    break
    remvc = list(filter(None, remv))
    remvvvc = list(filter(None, remvvv))
    xd = list(filter(None, temp))
    xdd = []
    xddd = []
    for elem in xd:
        subject = elem.split("\n")
        for elemm in subject:
            if elemm in remvc:
                subject.remove(elemm)
                xdd.append(list(filter(None, subject)))
    for index, elem in enumerate(list(filter(None, xdd))):
        xddd.append(
            [
                elem[0],
                wd[index],
                remvvvc[index].split(", ")[-1],
            ]
        )
"""


def get_full_plan() -> None:
    """
    Function to retrieve the full plan, including login process and downloading the plan PDF.
    This function does not take any parameters and does not return anything.
    Returns:
        None
    """
    loginpage = "https://cas.p.lodz.pl/cas/login?service=https%3A%2F%2Fweeia.edu.p.lodz.pl%2Flogin%2Findex.php%3FauthCAS%3DCAS"
    planpage = "https://weeia.edu.p.lodz.pl/mod/resource/view.php?id=63920"
    _eventId = "submit"

    with requests.session() as s:
        req = s.get(loginpage).text
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
        loginpage,
        data=payload,
        headers=headers,
    )
    r = s.get(planpage)
    open("plan.pdf", "wb").write(r.content)
    print("Waga pdf:", round(stat("plan.pdf").st_size / 1024, 1), "kB")
    print("Liczba stron:", len(PdfReader("plan.pdf").pages))


def get_plan_page(word) -> None:
    """
    Extracts the page containing the specified word from the 'plan.pdf' and saves it to 'planPage.pdf'
    Args:
        word (str): The word to search for in the PDF
    Returns:
        None
    """
    pdf_reader = PdfReader("plan.pdf")
    pdf_writer = PdfWriter()
    pages = pdf_reader.pages
    for page_nr, pg in enumerate(pages):
        if word in pg.extract_text():
            pdf_writer.add_page(pdf_reader.pages[page_nr])
            with open("planPage.pdf", "wb") as f:
                pdf_writer.write(f)
            break


def get_subjectnames():
    pdf = PDFQuery("planPage.pdf", normalize_spaces=True, resort=True)
    pdf.load()
    pdf.tree.write("plan.xml", pretty_print=True)
    box = pdf.get_page(0).mediabox
    with open("plan.xml", "r") as f:
        pdf = f.read()
    soup = BeautifulSoup(pdf, "xml")
    ltline = soup.find_all("LTLine")
    weekdays_limits = []
    for elem in ltline:
        if "5.631" in elem.get("bbox"):
            bbox = elem.get("bbox").strip("][").split(", ")
            top = round(box[3] - 306.76 - float(bbox[3]), 3)
            if top > 0:
                weekdays_limits.append(top)
    weekdays_limits.pop()
    print(weekdays_limits)
    elements = soup.find_all("LTTextLineHorizontal", attrs={"height": "7.92"})
    weekdays_limits = weekdays_limits  # <- must be removed
    last_day = 0  # <- must be zero
    elem_list = []
    for day in weekdays_limits:
        for elem in elements:
            if last_day <= (box[3] - 306.76 - float(elem.get("y1"))) <= day:
                elem_list.append(elem)
                print(elem)
        last_day = day
    temp = []
    data = []
    print(len(elem_list))
    current_element = ""
    for i in range(1, len(elem_list)):
        current_element = elem_list[i]
        last_element = elem_list[i - 1]
        if current_element.get("x0") == last_element.get("x0"):
            if (float(last_element.get("y0")) - float(current_element.get("y1"))) > 30:
                temp.append(last_element.get_text())
                data.append(temp)
                temp = []
            else:
                temp.append(last_element.get_text())
        elif len(temp) > 0:
            temp.append(last_element.get_text())
            data.append(temp)
            temp = []
    temp.append(current_element.get_text())
    data.append(temp)


if __name__ == "__main__":
    # get_full_plan()
    get_plan_page("6AiSR4")
    # convert_pdf_to_xml()
    get_subjectnames()
