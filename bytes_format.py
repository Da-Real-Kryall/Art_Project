# format text as bytes
import math
data = open("/Users/codyryall/Desktop/Art_Project/static/images/artwork.jpg", "rb").read()

res = """          00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F
00000000 """

i = 0
for index, byte in enumerate(data):
    if i == 16:
        res += "\n"+str(hex(index)[2:]).zfill(8).upper()+" "
        i = 0
    i += 1
    res += " "+str(hex(byte)).upper()[2:].zfill(2)

with open("/Users/codyryall/Desktop/text.txt", "w") as f:
    f.write(res)