from re import U


ulaz = list(input())
izlaz = list()

def Parser():
    valjanost = S()
    print("".join(izlaz))
    print("DA" if valjanost else "NE")

def S():
    izlaz.append("S")
    znak = ulaz.pop(0) if ulaz else ""
    if znak == "a":
        return A() and B()
    elif znak == "b":
        return B() and A()
    else: return False

def A():
    izlaz.append("A")
    znak = ulaz.pop(0) if ulaz else ""
    if znak == "b":
        return C()
    elif znak == "a":
        return True
    else: return False

def B():
    izlaz.append("B")
    znak = ulaz.pop(0) + ulaz.pop(0) if len(ulaz) >= 2 else ""
    if znak == "cc":
        s = S()
        znak = ulaz.pop(0) + ulaz.pop(0) if len(ulaz) >= 2 else ""
        if znak == "bc" and s:
            return True
        else: return False
    return True

def C():
    izlaz.append("C")
    return A() and A()

Parser()
