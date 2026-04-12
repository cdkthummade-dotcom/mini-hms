const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/JsBarcode-ARrGem50.js","assets/vendor--ejHCorC.js"])))=>i.map(i=>d[i]);
import{_ as t,j as e}from"./index-BzPCJM00.js";import{r as c,a as x}from"./vendor--ejHCorC.js";import{a as m,f}from"./SessionTimer-D4DncNi0.js";import"./axios-BOeqtr82.js";function h(r){const s=new Date,l=String(s.getDate()).padStart(2,"0"),n=String(s.getMonth()+1).padStart(2,"0"),o=s.getFullYear(),a=r!=null?String(r).padStart(3,"0"):"???";return`OPD/${l}${n}${o}/${a}`}function u({uid:r,patient:s,dailyToken:l}){const n=c.useRef(null);c.useEffect(()=>{!r||!n.current||t(async()=>{const{default:i}=await import("./JsBarcode-ARrGem50.js").then(d=>d.J);return{default:i}},__vite__mapDeps([0,1])).then(({default:i})=>{i(n.current,r,{format:"CODE128",width:1.8,height:45,displayValue:!0,fontSize:10})})},[r]);const o=new Date().toISOString(),a=l!=null?String(l):"—";h(l);const p=x.createPortal(e.jsxs("div",{className:"print-receipt",children:[e.jsx("style",{children:`
        .print-receipt { display: none; }

        @media print {
          @page { size: A4; margin: 0; }
          body > * { display: none !important; }

          /* Full-page flex column so notes fills remaining space */
          .print-receipt {
            display: flex !important;
            flex-direction: column;
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
            width: 100%;
            height: 297mm;
            padding: 10mm 14mm 8mm;
            box-sizing: border-box;
          }

          .pr-grow { flex: 1; display: flex; flex-direction: column; }

          /* ---------- helpers ---------- */
          .pr-between { display: flex; justify-content: space-between; align-items: flex-start; }
          .pr-center  { text-align: center; }
          .pr-bold    { font-weight: bold; }
          .pr-hr      { border: none; border-top: 1px solid #000; margin: 4px 0; flex-shrink: 0; }
          .pr-hr2     { border: none; border-top: 2px solid #000; margin: 4px 0; flex-shrink: 0; }

          /* ---------- header ---------- */
          .pr-hospital-name {
            font-size: 20px; font-weight: bold;
            letter-spacing: 1px; margin: 0 0 1px;
          }
          .pr-hospital-sub { font-size: 9px; margin: 1px 0; color: #222; }
          .pr-doc-title {
            font-size: 12px; font-weight: bold;
            letter-spacing: 2px; text-decoration: underline;
            margin: 4px 0 0;
          }

          /* ---------- patient info ---------- */
          .pr-info-row {
            display: flex;
            padding: 1px 0;
            line-height: 1.4;
          }
          .pr-info-label {
            font-weight: bold; width: 120px;
            flex-shrink: 0; font-size: 9px;
            text-transform: uppercase; color: #333;
          }
          .pr-info-colon { width: 12px; flex-shrink: 0; font-size: 9px; }
          .pr-info-value { flex: 1; font-size: 10px; }

          /* ---------- two-column ---------- */
          .pr-two-col   { display: flex; gap: 10px; }
          .pr-col-left  { flex: 1; }
          .pr-col-right { width: 160px; flex-shrink: 0; text-align: center; }

          /* ---------- consultant band ---------- */
          .pr-consultant-band {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f0f0f0;
            border: 1px solid #bbb;
            padding: 5px 10px;
            margin: 6px 0 4px;
            flex-shrink: 0;
          }
          .pr-consultant-name  { font-size: 13px; font-weight: bold; margin: 0; }
          .pr-token-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; margin: 0; }
          .pr-token-num   { font-size: 26px; font-weight: bold; font-family: monospace; line-height: 1; margin: 0; }

          /* ---------- validity ---------- */
          .pr-validity {
            border: 1px solid #999;
            padding: 3px 8px;
            font-size: 9px;
            margin: 0 0 4px;
            flex-shrink: 0;
          }

          /* ---------- mlc ---------- */
          .pr-mlc {
            border: 2px solid red;
            padding: 4px;
            text-align: center;
            color: red;
            font-weight: bold;
            font-size: 12px;
            margin: 4px 0;
            letter-spacing: 2px;
            flex-shrink: 0;
          }

          /* ---------- notes — fills all remaining space ---------- */
          .pr-notes-area {
            border: 1px solid #bbb;
            flex: 1;
            min-height: 120px;
            margin: 4px 0 6px;
            padding: 6px;
            font-size: 10px;
            color: #aaa;
          }

          /* ---------- bottom bar ---------- */
          .pr-bottom {
            flex-shrink: 0;
            border-top: 1px solid #ccc;
            padding-top: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9px;
            color: #444;
          }
        }
      `}),e.jsxs("div",{className:"pr-center",style:{paddingBottom:"4px",flexShrink:0},children:[e.jsx("p",{className:"pr-hospital-name",children:"DEMO HOSPITAL"}),e.jsx("p",{className:"pr-hospital-sub",children:"Main Center, Hyderabad, Telangana — 500 001"}),e.jsx("p",{className:"pr-hospital-sub",children:"Ph: 040-1234-5678  |  Emergency: 040-1234-5679"}),e.jsx("p",{className:"pr-doc-title",children:"OUT PATIENT REGISTRATION RECEIPT"})]}),e.jsx("hr",{className:"pr-hr2"}),e.jsx("div",{className:"pr-between",style:{padding:"2px 0",flexShrink:0},children:e.jsxs("span",{children:[e.jsx("span",{className:"pr-bold",children:"Reg. Date"})," : ",m(o)]})}),e.jsx("hr",{className:"pr-hr"}),e.jsxs("div",{className:"pr-two-col",style:{marginTop:"4px",flexShrink:0},children:[e.jsxs("div",{className:"pr-col-left",children:[e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Patient Name"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsxs("span",{className:"pr-info-value pr-bold",style:{fontSize:"12px"},children:[s==null?void 0:s.salutation," ",s==null?void 0:s.firstName," ",s==null?void 0:s.middleName," ",s==null?void 0:s.lastName]})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Registration No"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsx("span",{className:"pr-info-value pr-bold",style:{fontFamily:"monospace",fontSize:"11px",letterSpacing:"1px"},children:r})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Age / DOB"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsxs("span",{className:"pr-info-value",children:[s==null?void 0:s.ageYears," Yrs ",s==null?void 0:s.ageMonths," Mo  /  ",f(s==null?void 0:s.dob)||"—"]})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Gender"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsx("span",{className:"pr-info-value",children:s==null?void 0:s.gender})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Mobile"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsxs("span",{className:"pr-info-value",children:["+91 ",s==null?void 0:s.mobile]})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Patient Type"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsx("span",{className:"pr-info-value",children:s==null?void 0:s.patientTypeName})]}),e.jsxs("div",{className:"pr-info-row",children:[e.jsx("span",{className:"pr-info-label",children:"Referred By"}),e.jsx("span",{className:"pr-info-colon",children:":"}),e.jsx("span",{className:"pr-info-value",children:(s==null?void 0:s.referredByName)||"—"})]})]}),e.jsxs("div",{className:"pr-col-right",style:{borderLeft:"1px solid #ccc",paddingLeft:"10px"},children:[e.jsx("p",{style:{fontSize:"8px",margin:"0 0 3px",textTransform:"uppercase",letterSpacing:"1px",color:"#555"},children:"Scan to Verify"}),e.jsx("svg",{ref:n,style:{display:"block",margin:"0 auto",maxWidth:"100%"}}),e.jsx("p",{style:{fontSize:"8px",marginTop:"3px",color:"#555"},children:r})]})]}),e.jsx("hr",{className:"pr-hr",style:{marginTop:"4px"}}),e.jsxs("div",{className:"pr-consultant-band",children:[e.jsxs("div",{children:[e.jsx("p",{style:{fontSize:"8px",textTransform:"uppercase",letterSpacing:"1px",margin:"0 0 1px",color:"#555"},children:"Primary Consultant"}),e.jsx("p",{className:"pr-consultant-name",children:(s==null?void 0:s.consultantName)||"— Not Assigned —"})]}),e.jsxs("div",{style:{textAlign:"right"},children:[e.jsx("p",{className:"pr-token-label",children:"Token No."}),e.jsx("p",{className:"pr-token-num",children:a})]})]}),e.jsxs("div",{className:"pr-validity",children:[e.jsx("span",{className:"pr-bold",children:"Note:"})," This receipt is valid for"," ",e.jsx("span",{className:"pr-bold",children:"one free review visit within 15 days"})," from date of registration. Please carry this receipt for your next visit."]}),(s==null?void 0:s.isMlc)&&e.jsx("div",{className:"pr-mlc",children:"⚠ MEDICO-LEGAL CASE (MLC) ⚠"}),e.jsx("div",{className:"pr-notes-area pr-grow",children:"Doctor's Notes / Chief Complaints:"}),e.jsxs("div",{className:"pr-bottom",children:[e.jsx("span",{children:"Demo Hospital, Main Center, Hyderabad"}),e.jsx("span",{style:{fontWeight:"bold",fontSize:"11px"},children:"For Appointments: 040-1234-5678"})]})]}),document.body);return e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>window.print(),className:"bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800",children:"Print OPD Receipt"}),p]})}export{u as default};
