
from flask import Flask, render_template, request, redirect, session, send_file
import pandas as pd
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4, landscape
import tempfile

app = Flask(__name__)
app.secret_key = "CHANGE_ME"
EXCEL_FILE="data.xlsx"
ACCESS_CODES={"LAB2026":True}

def clean_sections(df):
    df["Section"]=pd.to_numeric(df["Section"],errors="coerce")
    df=df.dropna(subset=["Section"])
    df["Section"]=df["Section"].astype(int).astype(str)
    return df

@app.route("/", methods=["GET","POST"])
def login():
    if request.method=="POST":
        if request.form["code"] in ACCESS_CODES:
            session["logged_in"]=True
            return redirect("/dashboard")
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    if not session.get("logged_in"):
        return redirect("/")
    df=clean_sections(pd.read_excel(EXCEL_FILE))
    sections=sorted(df["Section"].unique())
    return render_template("dashboard.html", sections=sections)

@app.route("/dates/<section>")
def dates(section):
    df=clean_sections(pd.read_excel(EXCEL_FILE))
    dates=sorted(df[df["Section"]==str(section)]["Date"].astype(str).unique().tolist())
    return {"dates":dates}

def should_swap(df, section, date, labs):
    try:
        current=pd.to_datetime(date)
    except:
        return False
    prev=df[df["Section"]==str(section)].copy()
    count=0
    target=tuple(sorted(labs))
    for d in sorted(prev["Date"].astype(str).unique()):
        try:
            dd=pd.to_datetime(d)
        except:
            continue
        if dd >= current:
            continue
        labs_d=tuple(sorted(prev[prev["Date"].astype(str)==d]["Lab"].astype(str).unique().tolist()))
        if labs_d==target:
            count +=1
    return count % 2 == 1

def build_pdf(cards, filename):
    style = ParagraphStyle("Card",alignment=0,leading=11)
    cells=[]
    for r in cards:
        txt = f"""
        <font size="9"><b>Date:</b> {r['Date']}</font><br/>
        <font size="9"><b>Section:</b> {r['Section']}</font><br/>
        <font size="9"><b>Lecturer:</b> {r['Lecturer']}</font><br/>
        <font size="10"><b>Lab:</b> {r['Lab']}</font><br/>
        <font size="10"><b>Group:</b> {r['Group']}</font><br/><br/>
        <font size="16"><b>{r['Exam Code']}</b></font>
        """

        cells.append(Paragraph(txt, style))
    grid=[cells[i:i+3] for i in range(0,12,3)]
    doc=SimpleDocTemplate(filename,pagesize=landscape(A4),leftMargin=10,rightMargin=10,topMargin=10,bottomMargin=10)
    table = Table(grid,colWidths=265,rowHeights=135)
    table.setStyle(TableStyle([('GRID',(0,0),(-1,-1),1,colors.black),('VALIGN',(0,0),(-1,-1),'TOP')]))
    doc.build([table])

@app.route("/generate", methods=["POST"])
def generate():
    section=request.form["section"]
    date=request.form["date"]
    df=clean_sections(pd.read_excel(EXCEL_FILE))
    rows=df[(df["Section"]==str(section)) & (df["Date"].astype(str)==str(date))]
    records=rows[["Date","Section","Lab","Exam Code","Lecturer"]].to_dict("records")
    cards=[]
    if len(records)==1:
        for g in range(1,13):
            r=records[0].copy(); r["Group"]=g; cards.append(r)
    elif len(records)>=2:
        records=sorted(records,key=lambda x:str(x["Lab"]))
        swap=should_swap(df, section, date, [records[0]["Lab"],records[1]["Lab"]])
        first,second=(records[1],records[0]) if swap else (records[0],records[1])
        for g in range(1,7):
            r=first.copy(); r["Group"]=g; cards.append(r)
        for g in range(7,13):
            r=second.copy(); r["Group"]=g; cards.append(r)
    tmp=tempfile.NamedTemporaryFile(delete=False,suffix=".pdf"); tmp.close()
    build_pdf(cards,tmp.name)
    return send_file(tmp.name,as_attachment=True,download_name=f"Section_{section}.pdf")

if __name__=="__main__":
    app.run(debug=True)
