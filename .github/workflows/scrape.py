import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader, PdfWriter
from os import stat, environ
from localenv import localenv
import pdfquery

localenv()


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
    xd = soup.find_all('LTRect')
    for xdd in xd:
        # x0, y0, x1, y1
        bboxint = xdd.get('bbox')
        textt = xdd.get_text()
        text = textt.replace("\n", "")
        bbox = bboxint.strip('][').split(', ')
        remv = ""
        if (round(float(bbox[3]) - float(bbox[1]), 3)) == 9.12:
            remv = text
            print(remv)
        if text != '' and (float(bbox[3]) - float(bbox[1])) > 12:
            print("<div style=\"position:absolute; background:beige; width:", str(round(float(bbox[2]) - float(bbox[0]), 3)) + "px;",
                  "height:", str(round(float(bbox[3]) - float(bbox[1]), 3)) + "px;",
                  "top:", str(round(box.height - 306.76 - float(bbox[3]), 3)) + "px;",
                  "left:", str(round(float(bbox[0]) - 45.231, 3)) + "px;\">", text.strip(remv), "</div>")

    xddd = soup.find_all('LTLine')
    for xs in xddd:
        if "5.631" in xs.get('bbox'):
            bbox = xs.get('bbox').strip('][').split(', ')
            print("<div style=\"position:absolute; background:red; width:",
                  str(round(float(bbox[2]) - float(bbox[0]), 3)) + "px;",
                  "height:", str(round(float(bbox[3]) - float(bbox[1]) + 2, 3)) + "px;",
                  "top:", str(round(box.height - 306.76 - float(bbox[3]), 3)) + "px;",
                  "left:", str(round(float(bbox[0]) - 45.231, 3)) + "px;\">", text, "</div>")


def get_full_plan() -> None:
    """
    Function to retrieve the full plan, including login process and downloading the plan PDF.
    This function does not take any parameters and does not return anything.
    Returns:
        None
    """
    loginpage = "https://cas.p.lodz.pl/cas/login?service=https%3A%2F%2Fweeia.edu.p.lodz.pl%2Flogin%2Findex.php%3FauthCAS%3DCAS"
    planpage = "https://weeia.edu.p.lodz.pl/mod/resource/view.php?id=63920"
    username = environ.get("USERNAME")
    password = environ.get("PASSWORD")
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


if __name__ == "__main__":
    #get_full_plan()
    #get_plan_page("6AiSR4")
    convert_pdf_to_xml()
