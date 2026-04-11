const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/JsBarcode-ARrGem50.js","assets/vendor--ejHCorC.js"])))=>i.map(i=>d[i]);
import{b as m,_ as f,j as e}from"./index-BlVbBgf-.js";import{r as p,a as h}from"./vendor--ejHCorC.js";import{f as g,a as c}from"./SessionTimer-BU5AlMTw.js";import"./axios-BOeqtr82.js";function y({uid:r,patient:s,dailyToken:a}){const l=p.useRef(null),{user:n}=m();p.useEffect(()=>{!r||!l.current||f(async()=>{const{default:o}=await import("./JsBarcode-ARrGem50.js").then(x=>x.J);return{default:o}},__vite__mapDeps([0,1])).then(({default:o})=>{o(l.current,r,{format:"CODE128",width:1.8,height:50,displayValue:!0,fontSize:11})})},[r]);const i=new Date().toISOString(),d=a!=null?String(a):"—",t=h.createPortal(e.jsxs("div",{className:"print-receipt",children:[e.jsx("style",{children:`
        .print-receipt { display: none; }

        @media print {
          @page { size: A4; margin: 0; }
          body > * { display: none !important; }
          .print-receipt {
            display: block !important;
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
            width: 100%;
            padding: 12mm 15mm;
            box-sizing: border-box;
          }

          /* ---------- layout helpers ---------- */
          .pr-flex   { display: flex; }
          .pr-between{ display: flex; justify-content: space-between; align-items: flex-start; }
          .pr-center { text-align: center; }
          .pr-right  { text-align: right; }
          .pr-bold   { font-weight: bold; }
          .pr-hr     { border: none; border-top: 1px solid #000; margin: 6px 0; }
          .pr-hr2    { border: none; border-top: 2px solid #000; margin: 6px 0; }

          /* ---------- header ---------- */
          .pr-hospital-name {
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 1px;
            margin: 0 0 2px;
          }
          .pr-hospital-sub { font-size: 10px; margin: 1px 0; color: #222; }
          .pr-doc-title {
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 2px;
            text-decoration: underline;
            margin: 6px 0 0;
          }

          /* ---------- patient info grid ---------- */
          .pr-info-row {
            display: flex;
            padding: 3px 0;
          }
          .pr-info-label {
            font-weight: bold;
            width: 130px;
            flex-shrink: 0;
            font-size: 10px;
            text-transform: uppercase;
          }
          .pr-info-colon { width: 14px; flex-shrink: 0; }
          .pr-info-value { flex: 1; font-size: 11px; }

          /* ---------- two-column section ---------- */
          .pr-two-col { display: flex; gap: 12px; }
          .pr-col-left { flex: 1; }
          .pr-col-right { width: 180px; flex-shrink: 0; text-align: center; }

          /* ---------- consultant band ---------- */
          .pr-consultant-band {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f0f0f0;
            border: 1px solid #bbb;
            padding: 6px 10px;
            margin: 8px 0;
          }
          .pr-consultant-name { font-size: 13px; font-weight: bold; }
          .pr-consultant-dept { font-size: 10px; color: #333; margin-top: 2px; }
          .pr-token-box { text-align: right; }
          .pr-token-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
          .pr-token-num { font-size: 28px; font-weight: bold; font-family: monospace; line-height: 1; }

          /* ---------- validity ---------- */
          .pr-validity {
            border: 1px solid #999;
            padding: 4px 8px;
            font-size: 10px;
            margin: 6px 0;
          }

          /* ---------- mlc ---------- */
          .pr-mlc {
            border: 2px solid red;
            padding: 6px;
            text-align: center;
            color: red;
            font-weight: bold;
            font-size: 13px;
            margin: 8px 0;
            letter-spacing: 2px;
          }

          /* ---------- notes area ---------- */
          .pr-notes-area {
            border: 1px solid #bbb;
            height: 220px;
            margin: 8px 0;
            padding: 8px;
            font-size: 10px;
            color: #aaa;
          }

          /* ---------- footer ---------- */
          .pr-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 10px;
          }
          .pr-sig-line {
            border-top: 1px solid #000;
            margin-top: 30px;
            padding-top: 2px;
            font-size: 9px;
            text-align: center;
          }
          .pr-footer-note {
            border-top: 1px solid #ccc;
            margin-top: 10px;
            padding-top: 5px;
            text-align: center;
            font-size: 9px;
            color: #666;
          }
        }
      `}),e.jsxs("div",{className:"pr-center",style:{paddingBottom:"8px"},children:[e.jsx("p",{className:"pr-hospital-name",children:"DEMO HOSPITAL"}),e.jsx("p",{className:"pr-hospital-sub",children:"Main Center, Hyderabad, Telangana — 500 001"}),e.jsx("p",{className:"pr-hospital-sub",children:"Ph: 040-1234-5678  |  Emergency: 040-1234-5679"}),e.jsx("p",{className:"pr-doc-title",children:"OUT PATIENT REGISTRATION RECEIPT"})]}),e.jsx("hr",{className:"pr-hr2"}),e.jsx("div",{className:"pr-between",style:{padding:"2px 0 4px"},children:e.jsxs("span",{children:[e.jsx("span",{className:"pr-bold",children:"Bill No"})," : ",r]})}),e.jsx("hr",{className:"pr-hr"}),e.jsxs("div",{className:"pr-two-col",style:{marginTop:"6px"},children:[e.jsxs("div",{className:"pr-col-left",children:[e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Patient Name"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsxs("span",{className:"pr-info-value pr-bold",style:{fontSize:"13px"},children:[s==null?void 0:s.salutation," ",s==null?void 0:s.firstName," ",s==null?void 0:s.middleName," ",s==null?void 0:s.lastName]})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Registration No"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsx("span",{className:"pr-info-value pr-bold",style:{fontFamily:"monospace",fontSize:"13px",letterSpacing:"1px"},children:r})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Age / DOB"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsxs("span",{className:"pr-info-value",children:[s==null?void 0:s.ageYears," Yrs ",s==null?void 0:s.ageMonths," Mo  /  ",g(s==null?void 0:s.dob)||"Not provided"]})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Gender"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsx("span",{className:"pr-info-value",children:s==null?void 0:s.gender})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Mobile"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsxs("span",{className:"pr-info-value",children:["+91 ",s==null?void 0:s.mobile]})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Patient Type"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsx("span",{className:"pr-info-value",children:s==null?void 0:s.patientTypeName})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Referred By"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsx("span",{className:"pr-info-value",children:(s==null?void 0:s.referredByName)||"—"})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Reg. Date"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsx("span",{className:"pr-info-value",children:c(i)})]})]}),e.jsxs("div",{className:"pr-col-right",style:{borderLeft:"1px solid #ccc",paddingLeft:"10px"},children:[e.jsx("p",{style:{fontSize:"9px",margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"1px",color:"#555"},children:"Scan to Verify"}),e.jsx("svg",{ref:l,style:{display:"block",margin:"0 auto",maxWidth:"100%"}}),e.jsx("p",{style:{fontSize:"9px",marginTop:"4px",color:"#555"},children:r})]})]}),e.jsx("hr",{className:"pr-hr",style:{marginTop:"8px"}}),e.jsxs("div",{className:"pr-consultant-band",children:[e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"9px",textTransform:"uppercase",letterSpacing:"1px",margin:"0 0 2px",color:"#555"},children:"Primary Consultant"}),e.jsx("p",{className:"pr-consultant-name",children:(s==null?void 0:s.consultantName)||"— Not Assigned —"}),(s==null?void 0:s.consultantDept)&&e.jsx("p",{className:"pr-consultant-dept",children:s.consultantDept})]}),e.jsxs("div",{className:"pr-token-box",children:[e.jsx("p",{className:"pr-token-label",children:"Token No."}),e.jsx("p",{className:"pr-token-num",children:d})]})]}),e.jsxs("div",{className:"pr-validity",children:[e.jsx("span",{className:"pr-bold",children:"Note:"})," This receipt is valid for ",e.jsx("span",{className:"pr-bold",children:"one free review visit within 15 days"})," from the date of registration. Please carry this receipt for your next visit."]}),(s==null?void 0:s.isMlc)&&e.jsx("div",{className:"pr-mlc",children:"⚠ MEDICO-LEGAL CASE (MLC) ⚠"}),e.jsx("div",{className:"pr-notes-area",children:"Doctor's Notes / Chief Complaints:"}),e.jsx("hr",{className:"pr-hr"}),e.jsxs("div",{className:"pr-footer",children:[e.jsxs("div",{style:{flex:1},children:[e.jsxs("p",{style:{margin:0},children:[e.jsx("span",{className:"pr-bold",children:"Registered By"})," : ",n==null?void 0:n.fullName]}),e.jsxs("p",{style:{margin:"2px 0 0"},children:[e.jsx("span",{className:"pr-bold",children:"On"})," : ",c(i)]}),e.jsxs("p",{style:{margin:"2px 0 0"},children:[e.jsx("span",{className:"pr-bold",children:"Next Review On"})," : ___________________________"]}),e.jsxs("div",{className:"pr-sig-line",style:{marginTop:"24px",width:"160px"},children:["Authorized Signatory",e.jsx("br",{}),"For Demo Hospital"]})]}),e.jsxs("div",{style:{textAlign:"right",flex:1},children:[e.jsx("p",{style:{margin:0,fontSize:"10px",color:"#555"},children:"For Appointments Call"}),e.jsx("p",{style:{margin:"2px 0 6px",fontWeight:"bold",fontSize:"12px"},children:"040-1234-5678"}),e.jsx("div",{className:"pr-sig-line",style:{marginTop:"24px",display:"inline-block",width:"160px"},children:"DR. SIGNATURE"})]})]}),e.jsx("div",{className:"pr-footer-note",children:"This is a computer-generated receipt. No manual signature required for validity.  |  Demo Hospital, Main Center, Hyderabad — 040-1234-5678"})]}),document.body);return e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>window.print(),className:"bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800",children:"Print OPD Receipt"}),t]})}export{y as default};
