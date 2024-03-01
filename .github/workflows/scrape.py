import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader, PdfWriter
from os import stat, environ, path

if path.isfile("localenv.py"):
    from localenv import localenv
    import pprint

    pp = pprint.PrettyPrinter(indent=2, width=160)
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


if __name__ == "__main__":
    get_full_plan()
    get_plan_page("6AiSR4")
