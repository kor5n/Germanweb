from PIL import Image
from random import uniform, randint
import os

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_img(name):
    color_list = ["#2F3C7E", "#FBEAEB", "#101820", "#FEE715", "#F96167", "#F9E795","#990011", "#FCF6F5","#8AAAE5","#FFFFFF","#00246B","#89ABE3","#EA738D","#CC313D","#F7C5CC","#2C5F2D","#97BC62","#EDF4F2","#C4DFE6","#FFF2D7","#F98866"]
    
    code = 1
    code2 = 1
    while code == code2:
        if len(name)  > 1:
            code = round(uniform(3, len(name) * 3))
            code2 = round(uniform(3, len(name) * 3))
        else:
            code = randint(a=3,b=10)
            code2 = randint(a=3,b=10)

    image  = Image.new("RGB", (15,15), hex_to_rgb(color_list[round(uniform(0, len(color_list) - 1))]))

    #image.save("image.jpg")
    pixels = list(image.getdata())
    count = 0
    first_color = hex_to_rgb(color_list[round(uniform(0, len(color_list) - 1))])
    second_color = hex_to_rgb(color_list[round(uniform(0, len(color_list) - 1))])
    while count < len(pixels):
        if (count+1) % code == 0:
            new_color = first_color
            pixels[count] = new_color
        elif (count+1) % code2 == 0:
            new_color = second_color
            pixels[count] = new_color
        count +=1
        
    image.putdata(pixels)
    file_exists = True
    num = 1
    name = "profile" + str(num) + ".png"
    while file_exists == True:
        name = "profile" + str(num) + ".png"
        if os.path.exists("app/frontend/static/img/"+name):
            num +=1
        else:
            file_exists = False
    image.save("app/frontend/static/img/"+name)
    return name



#print(create_img(name = input("Whats your name?")))
