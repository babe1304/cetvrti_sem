from bs4 import BeautifulSoup
import requests

url = "https://www.links.hr/hr/tablet-lenovo-tab-m7-3-gen-za8c0054bg-7-2gb-32gb-android-11-sivi-010112446"
result = requests.get(url)
doc = BeautifulSoup(result.text, "html.parser")

cijena = doc.find_all(text="kn")[0].parent.parent.text
print(cijena)
