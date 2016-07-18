/*Main calculation functions*/

/*
==========WARNING==========
To keep the main function runs correctly, please do not modify function part if you are not familiar with Javascript.

The time is the date that author modifies the variables.
*/

/*
Update time:
*/
document.getElementById("update_time").innerHTML = "Updated at: 16 July 2016";

/*
Declare variables:
please DO NOT modify them.
*/
var taxableIncome, PAYG, resident, medicare, lowIncomeOffset, directDetails;

var temp_taxpayable, temp_brl, temp_medicare, temp_medicare_surcharge, temp_lio, result;

var detailButton = "<br /><input type=\"button\" id=\"getDetail\" value=\"get more details about the calculation\" onClick=\"showDetails()\">";
var detailField = "<div id=\"result_detail\"></div>";

var fontBoldB = "<strong>";
var fontBoldE = "</strong>";
var br = "<br />";

var tableTagB = "<table style=\"border:3px solid black;border-collapse: collapse\">";
var tableTagE = "</table>";
var trB = "<tr style=\"border:1px solid black;border-collapse: collapse\">";
var trE = "</tr>";
var thB = "<th style=\"border:1px solid black;border-collapse: collapse;padding: 5px\">";
var thBL = "<th style=\"text-align:left;1px solid black;border-collapse: collapsepadding: 5px\">";
var thE = "</th>";
var trB = "<tr style=\"border:1px solid black;border-collapse: collapse\">";
var trE = "</tr>";
var tdB = "<td style=\"border:1px solid black;border-collapse: collapse:padding: 5px\">";
var tdE = "</td>";
var tdBL = "<td style=\"text-align:left;1px solid black;border-collapse: collapse;padding: 5px\">";
var tdBR = "<td style=\"text-align:right;1px solid black;border-collapse: collapse;padding: 5px\">";

/*
Tax data config: 
You CAN modify the values according to your demand. Please do not modify the variables' name, and thereon part.

Some items are given another variables' name as values, you can also change them into number value.


varname format: partA_partB(_partC);

partA:
r/nr = resident/non-resident, for income taxpayable;
brl = Budget repair levy rate;
mc = medicare;
mcs = medicare surcharge;
lio = Low income offset;

partB(_partC):
t0 - 3 = taxable income level;
tr0 - 3 = tax rate;
max/min = maximum value / minimum value;
cpd = cent(s) per dollar;
*/
var r_t0 = 18200;
var r_t1 = 37000;
var r_t2 = 80000;
var r_t3 = 180000;

var nr_t0 = 0;
var nr_t1 = r_t2;
var nr_t2 = r_t3;

var r_tr0 = 0.19;
var r_tr1 = 0.325;
var r_tr2 = 0.37;
var r_tr3 = 0.45;

var nr_tr0 = r_tr1;
var nr_tr1 = r_tr2;
var nr_tr2 = r_tr3;

var brl_tr0 = 0.02;

var mc_t0 = 20897;
var mc_t1 = 26120;
var mc_tr0 = 0.1;
var mc_tr1 = 0.02;

var mcs_t0 = 90000;
var mcs_t1 = 105000;
var mcs_t2 = 140000;

var mcs_tr0 = 0;
var mcs_tr1 = 0.01;
var mcs_tr2 = 0.0125;
var mcs_tr3 = 0.015;

var lio_t0 = 37000;
var lio_max = 445;
var lio_cpd = 0.015;

/*Please do not change the following part.*/
var r_th1 = (r_t1 - r_t0) * r_tr0;
var r_th2 = (r_t2 - r_t1) * r_tr1 + r_th1;
var r_th3 = (r_t3 - r_t2) * r_tr2 + r_th2;

var nr_th0 = 0;
var nr_th1 = (nr_t1 - nr_t0) * nr_tr0;
var nr_th2 = (nr_t2 - nr_t1) * nr_tr1 + nr_th1;

var lio_t_max = lio_t0 + (lio_max / lio_cpd);

/*
Console Log:
The first line is for checking whether the value of thereon is the same with the textbook's tables or not.

If you think it is necessary to check it, delete "//" to activate them.
Restoring "//" to deactivate it.

Shortcut key for opening console:
Google Chrome: "F12" for Windows; "CMD+OPT+I" for macOS.
*/
//console.log(r_th1, r_th2, r_th3, nr_th0, nr_th1, nr_th2);

/*
Radio buttons status:
DO NOT modify this part.
*/
function resi() {
    resident = $('[name="resident"]:checked').val();
    console.log(resident);
    if (resident == "true") {
        document.getElementById("medicare0").disabled = false;
        document.getElementById("medicare1").disabled = false;
        document.getElementById("low_income_offset0").disabled = false;
        document.getElementById("low_income_offset1").disabled = false;
        document.getElementsByName("medicare")[0].checked = true;
        document.getElementsByName("low_income_offset")[0].checked = true;
    }else if (resident == "false") {
        document.getElementById("medicare0").disabled = true;
        document.getElementById("medicare1").disabled = true;
        document.getElementById("low_income_offset0").disabled = true;
        document.getElementById("low_income_offset1").disabled = true;
        document.getElementsByName("medicare")[1].checked = true;
        document.getElementsByName("low_income_offset")[1].checked = true;
    }
}

/*
Data acquiring:
Get the latest data from HTML page, and update the variables' values.
DO NOT modify this part.
*/
function dataAcquairing() {
    taxableIncome = document.getElementById("tax_income").value;
    PAYG = document.getElementById("payg_instalment").value;
    resident = $('[name="resident"]:checked').val();
    medicare = $('input[name="medicare"]:checked').val();
    lowIncomeOffset = $('[name="low_income_offset"]:checked').val();
    directDetails = $('[name="output_details"]').is(':checked');
}

/*
Input data validation:
If the input field is left empty, give 0 to taxable income and PAYG to prevent unknown errors happen in main function.
DO NOT modify this part.
*/
function dataValidation() {
    if (taxableIncome.length == 0) {
        taxableIncome = 0;
        window.alert("Please give your taxable income, it should not be 0 or less");
    }
    if (PAYG.length == 0) {
        PAYG = 0;
    }
}
    
/*
Main function:
please DO NOT modify this part if you are not familiar with Javascript.
*/
function main() {
    dataAcquairing();
    dataValidation();
    console.log(taxableIncome, PAYG, resident, medicare, lowIncomeOffset, directDetails);
    //Declare temporary variables.
    //var temp_taxpayable, temp_brl, temp_medicare, temp_medicare_surcharge, temp_lio, result;
    if (resident == "true") {
        //Taxable payable calculation.
        if (taxableIncome <= r_t0) {
            temp_taxpayable = 0;
        } else if (taxableIncome <= r_t1) {
            temp_taxpayable = (taxableIncome - r_t0) * r_tr0;
        } else if (taxableIncome <= r_t2) {
            temp_taxpayable = (taxableIncome - r_t1) * r_tr1 + r_th1;
        } else if (taxableIncome <= r_t3) {
            temp_taxpayable = (taxableIncome - r_t2) * r_tr2 + r_th2;
        } else if (taxableIncome > r_t3){
            temp_taxpayable = (taxableIncome - r_t3) * r_tr3 + r_th3;
        }
        
        //Temporary budget repair levy.
        temp_brl = (taxableIncome <= r_t3) ? 0 : (taxableIncome - r_t3) * brl_tr0;
        
        //Medicare.
        if (medicare == "true") {
            if (taxableIncome <= mc_t0) {
                temp_medicare = 0;
            } else if (taxableIncome <= mc_t1) {
                temp_medicare = (taxableIncome - mc_t0) * mc_tr0;
            } else if (taxableIncome > mc_t1) {
                temp_medicare = taxableIncome * mc_tr1;
            }
        } else if (medicare == "false") {
            temp_medicare = 0;
        }
        
        //Medicare surcharge.
        if (medicare == "true") {
            if (taxableIncome <= mcs_t0) {
                temp_medicare_surcharge = 0;
            } else if (taxableIncome <= mcs_t1) {
                temp_medicare_surcharge = taxableIncome * mcs_tr1;
            } else if (taxableIncome <= mcs_t2) {
                temp_medicare_surcharge = taxableIncome * mcs_tr2;
            } else if (taxableIncome > mcs_t2) {
                temp_medicare_surcharge = taxableIncome * mcs_tr3;
            }
        } else if (medicare == "false") {
            temp_medicare_surcharge = 0;
        }
        
        //Low income offset.
        switch (lowIncomeOffset) {
            case "true" :
                if (taxableIncome <= lio_t0) {
                    temp_lio = lio_max;
                } else if (taxableIncome <= lio_t_max) {
                    temp_lio = lio_max - (taxableIncome - lio_t0) * lio_cpd; 
                } else if (taxableIncome >lio_t_max) {
                    temp_lio = 0;
                }
                break;
            case "false" :
                temp_lio = 0;
                break;
        }
    }
    
    else if (resident == "false") {
        if (taxableIncome <= nr_t1) {
            temp_taxpayable = taxableIncome * nr_tr0;
        } else if (taxableIncome <= nr_t2) {
            temp_taxpayable = (taxableIncome - nr_t1) * nr_th1;
        } else if (taxableIncome > nr_t2) {
            temp_taxpayable = (taxableIncome - nr_t2) * nr_th2;
        }
        
        //Temporary budget repair levy.
        temp_brl = (taxableIncome <= nr_t2) ? 0 : (taxableIncome - nr_t2) * brl_tr0;
        
        // Zero value.
            temp_medicare = 0;
            temp_medicare_surcharge = 0;
            temp_lio = 0;
    }
    
    //result output.
    result = temp_taxpayable + temp_brl + temp_medicare + temp_medicare_surcharge - temp_lio - PAYG;
    //console.log("taxpayable: " + temp_taxpayable + " budget repair levy: " + temp_brl + " medicare: " + temp_medicare + " medicare surcharge: " + temp_medicare_surcharge + " low income offset: " + temp_lio);
    
    //Display result on webpage.
    if (taxableIncome == 0) {
        document.getElementById("result").innerHTML = "No result here."
    } else if (directDetails == true) {
        showDetails();
    } else if (directDetails == false) {
        document.getElementById("result").innerHTML = "Result: " + result.toFixed(0) + br + detailButton;
    } 
}

/*Extra functions*/

/*
Detail button:
Show details of calculations on the webpage.
*/
function showDetails() {
    document.getElementById("result").innerHTML = detailField;
    document.getElementById("result_detail").innerHTML = 
        tableTagB 
            + trB 
                + thBL + "Items" + thE
                + thB + "Amount" + thE
            + trE
            + trB
                + tdB + "Income tax payable" + tdE + tdBR + temp_taxpayable.toFixed(0) + tdE
            + trE
            + trB
                + tdB + "Budget repair levy" + tdE + tdBR + temp_brl.toFixed(0) + tdE
            + trE
            + trB
                + tdB + "Medicare" + tdE + tdBR + temp_medicare.toFixed(0) + tdE
            + trE
            + trB
                + tdB + "Medicare surcharge" + tdE + tdBR + temp_medicare_surcharge.toFixed(0) + tdE
            + trE
            + trB
                + tdB + "Low income offset" + tdE + tdBR + temp_lio.toFixed(0) + tdE
            + trE
            + trB
                + tdB + "PAYG instalment" + tdE + tdBR + PAYG + tdE
            + trE
            + trB
                + tdB + fontBoldB + "Total result" + fontBoldE + tdE + tdBR + fontBoldB + result.toFixed(0) + fontBoldE + tdE
            + trE
        +tableTagE;
}

function advFuncExpand() {
    document.getElementById("advancedFunctions").innerHTML = 
        "<a id=\"advFuncCollapse\" href=\"#\" onClick=\"advFuncCollapse()\" style=\"color:blue;text-decoration:underline\">Collapse the instruction</a>"
        + br
        + "<p>Open the browser's console(Google Chrome: F12 for Windows, CMD+OPT+I for macOS), input \"showMeData()\" to list all parameters quoted in this calculator.</p>"
}

function advFuncCollapse() {
    document.getElementById("advancedFunctions").innerHTML = 
        "<a id=\"advFuncExpand\" href=\"#\" onClick=\"advFuncExpand()\" style=\"color:blue;text-decoration:underline\">Expand the advanced functions instruction</a>"
}

function showMeData() {
    console.log("WARNING - all percentages are shown in decimal format.");
    console.log("");
    console.log("Resident - Taxable income level, Thereon and Tax rate");
    console.log(r_t0 + ", " + 0 + ", " + r_tr0);
    console.log(r_t1 + ", " + r_th1 + ", " + r_tr1);
    console.log(r_t2 + ", " + r_th2 + ", " + r_tr2);
    console.log(r_t3 + ", " + r_th3 + ", " + r_tr3);
    console.log("");
    console.log("Non-resident - Taxable income level, Thereon and Tax rate");
    console.log(nr_t0 + ", " + nr_th0 + ", " + nr_tr0);
    console.log(nr_t1 + ", " + nr_th1 + ", " + nr_tr1);
    console.log(nr_t2 + ", " + nr_th2 + ", " + nr_tr2);
    console.log("");
    console.log("Budget repair levy - rate: " + brl_tr0);
    console.log("");
    console.log("Medicare - Taxable income level and Tax rate");
    console.log(mc_t0 + ", " + mc_tr0);
    console.log(mc_t1 + ", " + mc_tr1);
    console.log("");
    console.log("Medicare surcharge - taxable income level and Tax rate");
    console.log(mcs_t0 + ", " + mcs_tr0);
    console.log(mcs_t1 + ", " + mcs_tr1);
    console.log(mcs_t2 + ", " + mcs_tr2);
    console.log("more than " + mcs_t2 + ", " + mcs_tr3);
    console.log("");
    console.log("Low income offset - Max offset, Max phase-out-free amount, Max taxable income and  phase out dollar per dollar");
    console.log(lio_max, lio_t0, Math.round(lio_t_max), lio_cpd);
}