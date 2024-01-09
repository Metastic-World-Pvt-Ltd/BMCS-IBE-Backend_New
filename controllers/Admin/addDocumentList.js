const projectDocuments = require('../../models/projectDocuments');

module.exports.addDocumentList = async function(req, res){
    // const {projectName , documentList} = req.body;
   
    // const projectId = Date.now();
    // const data = await projectDocuments.create({
    //     projectId ,projectName , documentList
    // })

    // res.json(data);
}

// {
//     "documents": [
      
//           {"mainField": "Company profile with business brief"},
//           {"mainField": "Individual profile with self-experience"},
//           {"mainField": "Details sheet filled"},
//           {"mainField": "Company PAN card"},
//           {"mainField": "COI (Certificate of incorporation)"},
//           {"mainField": "MOA (Memorandum of association)"},
//           {"mainField": "AOA (Article of association)"},
//           {"mainField": "Shareholding certificate"},
//           {"mainField": "Board resolution (updated)"},
//           {"mainField": "Company GST of all states"},
//           {"mainField": "MSME Certificate"},
//           {
//             "mainField": "1st Director Documents",
//             "subField": [
//               {"name": "(a) PAN Card"},
//               {"name": "(b) Aadhar Card"},
//               {"name": "(c) Photo"}
//             ]
//           },
//           {
//             "mainField": "2nd Director Documents",
//             "subField": [
//               {"name": "(a) PAN Card"},
//               {"name": "(b) Aadhar Card"},
//               {"name": "(c) Photo"}
//             ]
//           },
//           {
//             "mainField": "3rd Director Documents",
//             "subField": [
//               {"name": "(a) PAN Card"},
//               {"name": "(b) Aadhar Card"},
//               {"name": "(c) Photo"}
//             ]
//           },
//           {
//             "mainField": "3 years company financial * 2023-24",
//             "subField": [
//               {"name": "(a) ITR acknowledgement"},
//               {"name": "(b) Computation"},
//               {"name": "(c) Balance sheet, profit & loss and annexures"},
//               {"name": "(d) Audit report"}
//             ]
//           },
//           {
//             "mainField": "company financial * 2022-23",
//             "subField": [
//               {"name": "(a) ITR acknowledgement"},
//               {"name": "(b) Computation"},
//               {"name": "(c) Balance sheet, profit & loss and annexures"},
//               {"name": "(d) Audit report"}
//             ]
//           },
//           {
//             "mainField": "Company financials *2021-22",
//             "subField": [
//               {"name": "(a) ITR acknowledgement"},
//               {"name": "(b) Computation"},
//               {"name": "(c) Balance sheet, profit & loss and annexures"},
//               {"name": "(d) Audit report"}
//             ]
//           },
//           {
//             "mainField": "Director financials * 2023-24",
//             "subField": [
//               {"name": "(a) ITR/acknowledgement"},
//               {"name": "(b) Computation"}
//             ]
//           },
//           {
//             "mainField": "Director financials * 2022-23",
//             "subField": [
//               {"name": "(a) ITR/acknowledgement"},
//               {"name": "(b) Computation"}
//             ]
//           },
//           {
//             "mainField": "Director financials * 2021-22",
//             "subField": [
//               {"name": "(a) ITR/acknowledgement"},
//               {"name": "(b) Computation"}
//             ]
//           },
//           {
//             "mainField": "GST Return",
//             "subField": [
//               {"name": "(a) GSTR1 (01/04/2022-31/03/2023)"},
//               {"name": "(b) GSTR1 (01/04/2023-till date)"},
//               {"name": "(c) GSTR 3B(01/04/2022-31/03/2023)"},
//               {"name": "(d) GSTR 3B(01/04/2023-till date)"}
//             ]
//           },
//           {
//             "mainField": "(a) GSTR 3B(01/04/2022-31/03/2023)",
//             "subField": [
//               {"name": "(b) GSTR 3B(01/04/2023-till date)"}
//             ]
//           },
//           {
//             "mainField": "1st Current account statement",
//             "subField": [
//               {"name": "(a) 01/04/2022-31/03/23"},
//               {"name": "(b) 01/04/2023-till date"}
//             ]
//           },
//           {
//             "mainField": "2nd Current account statement",
//             "subField": [
//               {"name": "(a) 01/04/2022-31/03/23"},
//               {"name": "(b) 01/04/2023-till date"}
//             ]
//           },
//           {
//             "mainField": "All directors saving account",
//             "subField": [
//               {"name": "(a) 01/04/2023-till date (1st director)"},
//               {"name": "(b) 01/04/2023-till date (2nd director)"},
//               {"name": "(c) 01/04/2023-till date (3rd director)"},
//               {"name": "(d) 01/04/2023-till date (4th director)"}
//             ]
//           },
//           {"mainField": "Net worth certificate"},
//           {"mainField": "DPIIT Registration or startup registration"},
//           {"mainField": "Capital certificate"},
//           {"mainField": "Letterhead & with stamp"},
//           {"mainField": "01/04/2023-till date sale month-wise on letterhead company accordingly"},
//           {
//             "mainField": "All government license & certificate",
//             "subField": [
//               {"name": "(a) IEC (Import & Export certificate)"},
//               {"name": "(b) FSSAI (Food safety and standards authority of India)"}
//             ]
//           },
//           {
//             "mainField": "All loans sanction letter",
//             "subField": [
//               {"name": "(a)"},
//               {"name": "(b)"},
//               {"name": "(c)"},
//               {"name": "(d)"},
//               {"name": "(e)"},
//               {"name": "(f)"},
//               {"name": "(g)"},
//               {"name": "(h)"},
//               {"name": "(i)"},
//               {"name": "(j)"}
//             ]
//           },
//           {
//             "mainField": "Statement of account (SOA)",
//             "subField": [
//               {"name": "(a)"},
//               {"name": "(b)"},
//               {"name": "(c)"},
//               {"name": "(d)"},
//               {"name": "(e)"},
//               {"name": "(f)"},
//               {"name": "(g)"},
//               {"name": "(h)"},
//               {"name": "(i)"},
//               {"name": "(j)"}
//             ]
//           },
//           {
//             "mainField": "Interim balance sheet",
//             "subField": [
//               {"name": "(a) Balance sheet"},
//               {"name": "(b) Profit & loss"},
//               {"name": "(c) Annexures"}
//             ]
//           },
//           {
//             "mainField": "Provisional balance sheet",
//             "subField": [
//               {"name": "(a) Balance sheet"},
//               {"name": "(b) Profit & loss"},
//               {"name": "(c) Annexures"}
//             ]
//           },
//           {
//             "mainField": "Projected balance sheet",
//             "subField": [
//               {"name": "(a) Balance sheet"},
//               {"name": "(b) Profit & loss"}
//             ]
//           },
//           {
//             "mainField": "CMA Data 6 years",
//             "subField": [
//               {"name": "(a) 2021-22 to 2026-26"}
//             ]
//           },
//           {
//             "mainField": "Rent agreement",
//             "subField": [
//               {"name": "(a) Godown"},
//               {"name": "(b) Factory"},
//               {"name": "(c) House"},
//               {"name": "(d) Office"}
//             ]
//           },
//           {
//             "mainField": "Electricity bills",
//             "subField": [
//               {"name": "(a) Godown"},
//               {"name": "(b) Factory"},
//               {"name": "(c) House"},
//               {"name": "(d) Office"}
//             ]
//           },
//           {
//             "mainField": "Debtors & Creditors ageing",
//             "subField": [
//               {"name": "(a) 0-90 days"},
//               {"name": "(b) 90-180 days"},
//               {"name": "(c) 180+ days"}
//             ]
//           }
//     ]
//   }
  
  
  
  

  