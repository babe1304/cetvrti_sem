ulaz = list(input())
izlaz = list()
znak = ""

def Parser():    
    global znak
    znak = ulaz.pop(0) if ulaz else znak
    valjanost = S()
    print("".join(izlaz))
    print("DA" if valjanost and not ulaz else "NE")

def S():
    global znak
    izlaz.append("S")
    if znak == "a":
        znak = ulaz.pop(0) if ulaz else ""
        return A() and B()
    elif znak == "b":
        znak = ulaz.pop(0) if ulaz else ""
        return B() and A()
    else: return False

def A():
    global znak
    izlaz.append("A")
    if znak == "b":
        znak = ulaz.pop(0) if ulaz else ""
        return C()
    elif znak == "a":
        znak = ulaz.pop(0) if ulaz else ""
        return True
    else: return False

def B():
    global znak
    izlaz.append("B")
    if znak == "c":
        znak = ulaz.pop(0) if ulaz else ""
        if znak == "c":
            znak = ulaz.pop(0) if ulaz else ""
            s = S()
            if not ulaz: return False   
            znak += ulaz.pop(0)
            if znak != "bc" and not s: return False
            znak = ulaz.pop(0) if ulaz else ""
        else: return False
    return True

def C():
    #print(f'C: {"".join(ulaz)}')
    izlaz.append("C")
    return A() and A()

Parser()