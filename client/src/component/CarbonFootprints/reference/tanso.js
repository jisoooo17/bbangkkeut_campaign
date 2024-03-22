function calc(target) {
  if (typeof target === "number") {
    return target.toFixed(1);
  } else if (typeof target === "string") {
    return parseFloat(target).toFixed(1);
  } else {
    console.error("Error: target is not a number or string");
  }
}

var insertOk = false;

var resultIdx = 0;

var checkElec = 0;
var checkGas = 0;
var checkWater = 0;
var checkOil = 0;
var checkTrash = 0;
var goalElec = 0;
var goalGas = 0;
var goalWater = 0;
var goalOil = 0;
var goalTrash = 0;

// 기업 목표 선택 클래스
var selectStep;

function updateChartLengthBars() {
  $(".chart_h_container").each(function () {
    var numValue = parseInt($(this).find(".chart_num").text());
    var maxValue = 100;
    var calculatedH = Math.min((numValue / maxValue) * 100, 100);

    $(this)
      .find(".chart_bar")
      .css("height", calculatedH + "%");
  });
}

function updateChartWidthBars(elect, gas, water, traffic, trash, selectStepWGrapeTotalValue, classNm) {
  $(".company_target_bottom_left_content").each(function () {
    var calculatedWElect = (elect / selectStepWGrapeTotalValue) * 100;
    var calculatedWGas = (gas / selectStepWGrapeTotalValue) * 100;
    var calculatedWWater = (water / selectStepWGrapeTotalValue) * 100;
    var calculatedWTraffic = (traffic / selectStepWGrapeTotalValue) * 100;
    var calculatedWTrash = (trash / selectStepWGrapeTotalValue) * 100;

    if (classNm.includes("elect")) {
      $(this)
        .find(".elec_chart_bar")
        .css("width", calculatedWElect + "%");
    } else if (classNm.includes("gas")) {
      $(this)
        .find(".gas_chart_bar")
        .css("width", calculatedWGas + "%");
    } else if (classNm.includes("water")) {
      $(this)
        .find(".water_chart_bar")
        .css("width", calculatedWWater + "%");
    } else if (classNm.includes("traffic")) {
      $(this)
        .find(".traffic_chart_bar")
        .css("width", calculatedWTraffic + "%");
    } else if (classNm.includes("trash")) {
      $(this)
        .find(".trash_chart_bar")
        .css("width", calculatedWTrash + "%");
    }
  });

  $(".household_target_bottom_left_content").each(function () {
    var calculatedWElect2 = (elect / selectStepWGrapeTotalValue) * 100;
    var calculatedWGas2 = (gas / selectStepWGrapeTotalValue) * 100;
    var calculatedWWater2 = (water / selectStepWGrapeTotalValue) * 100;
    var calculatedWTraffic2 = (traffic / selectStepWGrapeTotalValue) * 100;
    var calculatedWTrash2 = (trash / selectStepWGrapeTotalValue) * 100;

    if (classNm.includes("elect")) {
      $(this)
        .find(".elec_chart_bar")
        .css("width", calculatedWElect2 + "%");
    } else if (classNm.includes("gas")) {
      $(this)
        .find(".gas_chart_bar")
        .css("width", calculatedWGas2 + "%");
    } else if (classNm.includes("water")) {
      $(this)
        .find(".water_chart_bar")
        .css("width", calculatedWWater2 + "%");
    } else if (classNm.includes("traffic")) {
      $(this)
        .find(".traffic_chart_bar")
        .css("width", calculatedWTraffic2 + "%");
    } else if (classNm.includes("trash")) {
      $(this)
        .find(".trash_chart_bar")
        .css("width", calculatedWTrash2 + "%");
    }
  });
}

function calculateTotalValue(checkName) {
  var selectStepWGrapeValueElect = 0;
  var selectStepWGrapeValueGas = 0;
  var selectStepWGrapeValueWater = 0;
  var selectStepWGrapeValueTraffic = 0;
  var selectStepWGrapeValueTrash = 0;
  var selectStepWGrapeTotalValue = 0;

  if (checkName?.includes("elect")) {
    $('.elect_check_container input[type="checkbox"]:checked').each(function () {
      if ($(this).attr("value")) {
        selectStepWGrapeValueElect += parseFloat($(this).attr("value"));
      }
    });
    $('.elect_check_container input[type="checkbox"]').each(function () {
      if ($(this).attr("value")) {
        selectStepWGrapeTotalValue += parseFloat($(this).attr("value"));
      }
    });
  } else if (checkName?.includes("gas")) {
    $('.gas_check_container input[type="checkbox"]:checked').each(function () {
      if ($(this).attr("value")) {
        selectStepWGrapeValueGas += parseFloat($(this).attr("value"));
      }
    });
    $('.gas_check_container input[type="checkbox"]').each(function () {
      if ($(this).attr("value")) {
        selectStepWGrapeTotalValue += parseFloat($(this).attr("value"));
      }
    });
  } else if (checkName?.includes("water")) {
    $('.water_check_container input[type="checkbox"]:checked').each(function () {
      if ($(this).attr("value")) {
        selectStepWGrapeValueWater += parseFloat($(this).attr("value"));
      }
    });
    $('.water_check_container input[type="checkbox"]').each(function () {
      if ($(this).attr("value")) {
        selectStepWGrapeTotalValue += parseFloat($(this).attr("value"));
      }
    });
  } else if (checkName?.includes("traffic")) {
    $('.traffic_check_container input[type="checkbox"]:checked').each(function () {
      if ($(this).attr("value")) {
        selectStepWGrapeValueTraffic += parseFloat($(this).attr("value"));
      }
    });
    $('.traffic_check_container input[type="checkbox"]').each(function () {
      if ($(this).attr("value")) {
        selectStepWGrapeTotalValue += parseFloat($(this).attr("value"));
      }
    });
  } else if (checkName?.includes("trash")) {
    $('.trash_check_container input[type="checkbox"]:checked').each(function () {
      if ($(this).attr("value")) {
        selectStepWGrapeValueTrash += parseFloat($(this).attr("value"));
      }
    });
    $('.trash_check_container input[type="checkbox"]').each(function () {
      if ($(this).attr("value")) {
        selectStepWGrapeTotalValue += parseFloat($(this).attr("value"));
      }
    });
  }

  if (checkName) {
    updateChartWidthBars(
      selectStepWGrapeValueElect,
      selectStepWGrapeValueGas,
      selectStepWGrapeValueWater,
      selectStepWGrapeValueTraffic,
      selectStepWGrapeValueTrash,
      selectStepWGrapeTotalValue,
      checkName
    );
  }
}

$(document).ready(function () {
  $(document).on("click", 'input[name="traffic_type"]', function () {
    $(".oil_usage").val("");

    $(".oilCo2 .number_length").each(function () {
      $(this).val("");
    });
  });
  $(document).on("input", ".trash_use_input .trash_L", function () {
    if ($(".trash_L").val() !== "") {
      $(".trash_Kg").val("");
    }
  });
  $(document).on("input", ".trash_use_input .trash_Kg", function () {
    if ($(".trash_Kg").val() !== "") {
      $(".trash_L").val("");
    }
  });

  $(document).on("keyup", ".elect_usage", function () {
    var elecUsed = $(this).val();
    var elecCo2 = calc(elecUsed * 0.4781);
    $(".DDCN_elect").val(elecCo2);
    printNumber("elecCo2", elecCo2);
    total();
  });

  $(document).on("keyup", ".gas_usage", function () {
    var gasUsed = $(this).val();
    var gasCo2 = calc(gasUsed * 2.176);
    $(".DDCN_gas").val(gasCo2);
    printNumber("gasCo2", gasCo2);
    total();
  });

  $(document).on("keyup", ".water_usage", function () {
    var waterUsed = $(this).val();
    var waterCo2 = calc(waterUsed * 0.237);
    $(".DDCN_water").val(waterCo2);
    printNumber("waterCo2", waterCo2);
    total();
  });

  $(document).on("keyup", ".oil_usage", function () {
    var oilUsed = $(this).val();
    var oilCo2;
    var trafficType = $('input[name="traffic_type"]:checked').val();
    if (trafficType == 3) {
      oilCo2 = 0;
      $(".oil_usage").val("");
      printNumber("oilCo2", 0);
    } else {
      if (trafficType == 0) {
        //휘발유
        oilCo2 = calc((oilUsed / 16.04) * 2.097);
      } else if (trafficType == 1) {
        //경유
        oilCo2 = calc((oilUsed / 15.35) * 2.582);
      } else if (trafficType == 2) {
        //LPG
        oilCo2 = calc((oilUsed / 11.06) * 1.868);
      }
      if (oilCo2 == 0) {
        oilCo2 = 0;
        printNumber("oilCo2", 0);
      } else {
        printNumber("oilCo2", oilCo2);
      }
    }
    $(".DDCN_oil").val(oilCo2);
    total();
  });

  $(document).on("keyup", ".trash_usage", function () {
    var trashUsed = $(this).val();
    var trashCo2;
    var trashType = $(this).attr("class");
    if (trashType.indexOf("trash_L") !== -1) {
      trashCo2 = calc(0.171 * trashUsed * 0.5573);
    } else if (trashType.indexOf("trash_Kg") !== -1) {
      trashCo2 = calc(trashUsed * 0.5573);
    }
    $(".DDCN_trash").val(trashCo2);
    printNumber("trashCo2", trashCo2);
    total();
  });
});

$(document).ready(function () {
  $(document).on("change", ".selAddress", function () {
    var selectedValue = $(this).val();

    if (selectedValue === "직접입력") {
      $(".tanso_modal_email").prop("disabled", false).val(selectedValue);
    } else {
      $(".tanso_modal_email").prop("disabled", true).val(selectedValue);
    }
  });
});

$(document).ready(function () {
  $(" section.company_two_step, section.company_three_step , section.household_two_step, section.household_three_step").css({
    position: "fixed",
    "z-index": "-1",
    opacity: "0",
  });
  $(".chart_num").each(function () {
    $(".chart_num").text("0kg");
  });

  if ($(".household_img_download").length > 0) {
    selectStep = "household_sub_step_one";
  } else if ($(".company_img_download").length > 0) {
    selectStep = "company_sub_step_one";
  }

  $(document).on("click", ".sub_menu_company li , .sub_menu_household li", function () {
    if (insertOk) {
      var className = $(this).attr("class");

      $("section.company_one_step, section.company_two_step, section.company_three_step , section.household_one_step, section.household_two_step, section.household_three_step").css({
        position: "fixed",
        "z-index": "-1",
        opacity: "0",
      });

      // 선택된 li에 .on 클래스 추가
      $(".sub_menu_company li , .sub_menu_household li").removeClass("on");
      $(this).addClass("on");

      // 클릭한 클래스에 해당하는 div 보이게 함
      $("." + className).css({
        position: "static",
        "z-index": "1",
        opacity: "1",
      });
      console.log($(this).hasClass("company_one_step"));
      console.log($(this).hasClass("household_one_step"));
      console.log($(this).hasClass("company_one_step") || $(this).hasClass("household_one_step"));

      if ($(this).hasClass("company_one_step") || $(this).hasClass("household_one_step")) {
        $(".title_info_box").css("display", "flex");
      } else {
        $(".title_info_box").css("display", "none");
      }
    } else {
      alert("제출하기 완료하신 후에 결과확인하실 수 있습니다.");
      e.preventDefault();
      return false;
    }
  });

  $(document).on("mousedown", ".company_img_download_container input[type=checkbox] + label", function (e) {
    e.stopPropagation();
    e.preventDefault();
    $(this).toggleClass("on_input");
  });

  $(document).on("mousedown", ".household_img_download_container input[type=checkbox] + label", function () {
    $(this).toggleClass("on_input");
  });
});

$(document).ready(function () {
  //기업용 실천목표 체크박스 효과, 그래프 그리기
  $(document).on("change", 'div.company_img_target_box_bottom_content .result_check_container input[type="checkbox"]', function () {
    var clickedCheckboxClass = $(this).attr("class");
    $('.company_img_download input[type="checkbox"]').each(function () {
      var otherCheckboxClass = $(this).attr("class");
      if (otherCheckboxClass && otherCheckboxClass.includes(clickedCheckboxClass)) {
        var num = $("." + clickedCheckboxClass).val();
        if ($(this).next("label").hasClass("on_input")) {
          $(this).next("label").removeClass("on_input");

          checkCalc("minus", clickedCheckboxClass, num);
        } else {
          $(this).next("label").addClass("on_input");
          checkCalc("plus", clickedCheckboxClass, num);
        }
      }
    });
    var elecCo2 = $(".DDCN_elect").val();
    var gasCo2 = $(".DDCN_gas").val();
    var waterCo2 = $(".DDCN_water").val();
    var oilCo2 = $(".DDCN_oil").val();
    var trashCo2 = $(".DDCN_trash").val();
    /* 기업용 실천목표*/
    var companyPartialCo2Bar = $(".company_target_goal_bar_chart .chart_h_container .partialCo2_bar");
    var selectStepGraphValue;
    var selectStepDefaultValue;
    if (selectStep === "company_sub_step_one") {
      selectStepGraphValue = checkElec;
      selectStepDefaultValue = elecCo2;
    } else if (selectStep === "company_sub_step_two") {
      selectStepGraphValue = checkGas;
      selectStepDefaultValue = gasCo2;
    } else if (selectStep === "company_sub_step_three") {
      selectStepGraphValue = checkWater;
      selectStepDefaultValue = waterCo2;
    } else if (selectStep === "company_sub_step_four") {
      selectStepGraphValue = checkOil;
      selectStepDefaultValue = oilCo2;
    } else if (selectStep === "company_sub_step_five") {
      selectStepGraphValue = checkTrash;
      selectStepDefaultValue = trashCo2;
    }

    var selectStepGraphmaxValue = 100;

    var companyCalculatedH = Math.min(((Math.round(selectStepDefaultValue) - selectStepGraphValue) / selectStepGraphmaxValue) * 100, 100);

    var goalValue = calc(selectStepDefaultValue - selectStepGraphValue);

    if (goalValue > 0) {
      $(".company_target_goal_bar_chart .chart_h_container .partialCo2Goal").text(goalValue + "kg");
    } else {
      $(".company_target_goal_bar_chart .chart_h_container .partialCo2Goal").text("0kg");
    }
    companyPartialCo2Bar.css("height", companyCalculatedH + "%");
  });

  /* 위에 리스트 클릭했을떄 해당하는 container 노출 */
  $(document).on("click", ".company_target_top_box_top ul li", function () {
    if ($(this).hasClass("on")) {
      return;
    }

    var companySelectedClass = $(this).attr("class");
    $(this).addClass("on");
    $(this).siblings().removeClass("on");
    selectStep = companySelectedClass;

    $(this).closest(".company_target_top_box_top").next(".company_target_top_box_bottom").find("> div").removeClass("on");
    $(this)
      .closest(".company_target_top_box_top")
      .next(".company_target_top_box_bottom")
      .find("." + companySelectedClass)
      .addClass("on");

    var elecCo2 = $(".DDCN_elect").val();
    var gasCo2 = $(".DDCN_gas").val();
    var waterCo2 = $(".DDCN_water").val();
    var oilCo2 = $(".DDCN_oil").val();
    var trashCo2 = $(".DDCN_trash").val();

    if (companySelectedClass === "company_sub_step_one") {
      $(".partialCo2").text(elecCo2 + "kg");
      $(".partialCo2Goal").text(goalElec + "kg");
    } else if (companySelectedClass === "company_sub_step_two") {
      $(".partialCo2").text(gasCo2 + "kg");
      $(".partialCo2Goal").text(goalGas + "kg");
    } else if (companySelectedClass === "company_sub_step_three") {
      $(".partialCo2").text(waterCo2 + "kg");
      $(".partialCo2Goal").text(goalWater + "kg");
    } else if (companySelectedClass === "company_sub_step_four") {
      $(".partialCo2").text(oilCo2 + "kg");
      $(".partialCo2Goal").text(goalOil + "kg");
    } else if (companySelectedClass === "company_sub_step_five") {
      $(".partialCo2").text(trashCo2 + "kg");
      $(".partialCo2Goal").text(goalTrash + "kg");
    }
    updateChartLengthBars();
  });
});

$(document).ready(function () {
  $(document).on("change", 'div.household_img_target_box_bottom_content .result_check_container input[type="checkbox"]', function () {
    var clickedCheckboxClass = $(this).attr("class");
    $('.household_img_download input[type="checkbox"]').each(function () {
      var otherCheckboxClass2 = $(this).attr("class");
      if (otherCheckboxClass2 && otherCheckboxClass2.includes(clickedCheckboxClass)) {
        var num2 = $("." + clickedCheckboxClass).val();
        if ($(this).next("label").hasClass("on_input")) {
          $(this).next("label").removeClass("on_input");

          checkCalc("minus", clickedCheckboxClass, num2);
        } else {
          $(this).next("label").addClass("on_input");

          checkCalc("plus", clickedCheckboxClass, num2);
        }
      }
    });
    var elecCo2 = $(".DDCN_elect").val();
    var gasCo2 = $(".DDCN_gas").val();
    var waterCo2 = $(".DDCN_water").val();
    var oilCo2 = $(".DDCN_oil").val();
    var trashCo2 = $(".DDCN_trash").val();

    var houseHoldPartialCo2Bar = $(".household_target_goal_bar_chart .chart_h_container .partialCo2_bar");
    var selectStepGraphValue;
    var selectStepDefaultValue;
    if (selectStep === "household_sub_step_one") {
      selectStepGraphValue = checkElec;
      selectStepDefaultValue = elecCo2;
    } else if (selectStep === "household_sub_step_two") {
      selectStepGraphValue = checkGas;
      selectStepDefaultValue = gasCo2;
    } else if (selectStep === "household_sub_step_three") {
      selectStepGraphValue = checkWater;
      selectStepDefaultValue = waterCo2;
    } else if (selectStep === "household_sub_step_four") {
      selectStepGraphValue = checkOil;
      selectStepDefaultValue = oilCo2;
    } else if (selectStep === "household_sub_step_five") {
      selectStepGraphValue = checkTrash;
      selectStepDefaultValue = trashCo2;
    }

    var selectStepGraphmaxValue = 100;

    var householdCalculatedH = Math.min(((Math.round(selectStepDefaultValue) - selectStepGraphValue) / selectStepGraphmaxValue) * 100, 100);

    var goalValue = calc(selectStepDefaultValue - selectStepGraphValue);

    if (goalValue > 0) {
      $(".household_target_goal_bar_chart .chart_h_container .partialCo2Goal").text(goalValue + "kg");
    } else {
      $(".household_target_goal_bar_chart .chart_h_container .partialCo2Goal").text("0kg");
    }
    houseHoldPartialCo2Bar.css("height", householdCalculatedH + "%");
  });

  $(document).on("click", ".household_target_top_box_top ul li", function () {
    if ($(this).hasClass("on")) {
      return;
    }
    var householdSelectedClass = $(this).attr("class");
    $(this).addClass("on");
    $(this).siblings().removeClass("on");
    selectStep = householdSelectedClass;

    $(this).closest(".household_target_top_box_top").next(".household_target_top_box_bottom").find("> div").removeClass("on");
    $(this)
      .closest(".household_target_top_box_top")
      .next(".household_target_top_box_bottom")
      .find("." + householdSelectedClass)
      .addClass("on");

    var elecCo2 = $(".DDCN_elect").val();
    var gasCo2 = $(".DDCN_gas").val();
    var waterCo2 = $(".DDCN_water").val();
    var oilCo2 = $(".DDCN_oil").val();
    var trashCo2 = $(".DDCN_trash").val();
    var co2_elec_avg = document.querySelector(".elec_avg_name").textContent;
    var co2_gas_avg = document.querySelector(".gas_avg_name").textContent;
    var co2_water_avg = document.querySelector(".water_avg_name").textContent;
    var co2_car_avg = document.querySelector(".car_avg_name").textContent;
    var co2_trash_avg = document.querySelector(".trash_avg_name").textContent;

    if (householdSelectedClass === "household_sub_step_one") {
      $(".partialCo2").text(elecCo2 + "kg");
      $(".partialCo2Goal").text(goalElec + "kg");
      $(".partialCo2Avg").text(co2_elec_avg);
    } else if (householdSelectedClass === "household_sub_step_two") {
      $(".partialCo2").text(gasCo2 + "kg");
      $(".partialCo2Goal").text(goalGas + "kg");
      $(".partialCo2Avg").text(co2_gas_avg);
    } else if (householdSelectedClass === "household_sub_step_three") {
      $(".partialCo2").text(waterCo2 + "kg");
      $(".partialCo2Goal").text(goalWater + "kg");
      $(".partialCo2Avg").text(co2_water_avg);
    } else if (householdSelectedClass === "household_sub_step_four") {
      $(".partialCo2").text(oilCo2 + "kg");
      $(".partialCo2Goal").text(goalOil + "kg");
      $(".partialCo2Avg").text(co2_car_avg);
    } else if (householdSelectedClass === "household_sub_step_five") {
      $(".partialCo2").text(trashCo2 + "kg");
      $(".partialCo2Goal").text(goalTrash + "kg");
      $(".partialCo2Avg").text(co2_trash_avg);
    }
    updateChartLengthBars();
  });
});

$(document).on("click", ".saveBtn", function () {
  if ($('input[name="memberName1"]').val() === "") {
    alert("이름을 입력해주시기 바랍니다.");
    $('input[name="memberName1"]').focus();
  } else if (!$(".house_agree").hasClass("on_input")) {
    alert("개인정보 수집 및 이용에 동의해주시기 바랍니다.");
    e.preventDefault();
    return;
  } else {
    //ajax 통신 성공후 사용량 분석, 실천 목표, 종합평가 보이기
    $(".after").css("display", "block");
  }
});

function businessSubmit() {
  $("html, body").animate(
    {
      scrollTop: 0,
    },
    "fast"
  );
  var trashInput = document.getElementsByClassName("trash_usage");
  if (
    $(".elect_usage").val() == "" ||
    $(".gas_usage").val() == "" ||
    $(".water_usage").val() == "" ||
    ($('input[name="traffic_type"]:checked').attr("value") !== "3" && $(".oil_usage").val() == "") ||
    (trashInput[0].value === "" && trashInput[1].value === "")
  ) {
    alert("모든 칸을 입력해 주세요!");
    return false;
  }
  var tansoType = "BUSINESS";
  var memberName = "BUSINESS";
  var trashType = "S";

  var targetUrl = "/tanso/insert_data2.green";

  var trafficType = $('input[name="traffic_type"]:checked').val();

  var elecUsed = $(".elect_usage").val();
  var gasUsed = $(".gas_usage").val();
  var waterUsed = $(".water_usage").val();
  var oilUsed = $(".oil_usage").val();
  var trashUsed = $(".trash_usage").val();
  var elecCo2 = $(".DDCN_elect").val();
  var gasCo2 = $(".DDCN_gas").val();
  var waterCo2 = $(".DDCN_water").val();
  var oilCo2 = $(".DDCN_oil").val();
  var trashCo2 = $(".DDCN_trash").val();
  var totalCo2 = $(".DDCN_total").val();

  var formData =
    "memberName=" +
    memberName +
    "&usedElec=" +
    elecUsed +
    "&elecCo2=" +
    elecCo2 +
    "&usedGas=" +
    gasUsed +
    "&gasCo2=" +
    gasCo2 +
    "&usedWater=" +
    waterUsed +
    "&waterCo2=" +
    waterCo2 +
    "&usedCar=" +
    oilUsed +
    "&carCo2=" +
    oilCo2 +
    "&oilCar=" +
    trafficType +
    "&memberTotalCo2=" +
    totalCo2 +
    "&trashType=" +
    trashType +
    "&usedTrash=" +
    trashUsed +
    "&trashCo2=" +
    trashCo2 +
    "&tansoType=" +
    tansoType;

  $.ajax({
    url: targetUrl,
    data: formData,
    type: "POST",
    dataType: "json",
    contentType: "application/x-www-form-urlencoded; charset=euc-kr",
    success: function (data) {
      insertOk = true;
      resultIdx = data.resultIdx;

      //결과보기로 이동 - ajax 통신 이후
      $("section.company_one_step, section.company_two_step, section.company_three_step").css({
        position: "fixed",
        "z-index": "-1",
        opacity: "0",
      });
      $(".sub_menu_company li").removeClass("on");
      $(".company_two_step").addClass("on");

      $(".title_info_box").css("display", "none");
      $(".company_two_step").css({
        position: "static",
        "z-index": "1",
        opacity: "1",
      });

      businessDraw(elecCo2, gasCo2, waterCo2, oilCo2, trashCo2, totalCo2);
    },
  });
  if (elecCo2 !== null && gasCo2 !== null && waterCo2 !== null && oilCo2 !== null && trashCo2 !== null) {
    drawDoughnutChartBusiness(elecCo2, gasCo2, waterCo2, oilCo2, trashCo2);
  }
  calculateTotalValue();
}

function businessDraw(elecCo2, gasCo2, waterCo2, oilCo2, trashCo2, totalCo2) {
  //부문별 실천목표 그래프 처음에 0이 안나오게
  goalElec = elecCo2;
  goalGas = gasCo2;
  goalWater = waterCo2;
  goalOil = oilCo2;
  goalTrash = trashCo2;

  $(".partialCo2").text(elecCo2 + "kg");
  $(".partialCo2Goal").text(elecCo2 + "kg");
  $(".totalCo2").text(totalCo2 + "kg");
  $(".car_total_name").text("0kg");
  $(".goalTotal").text("0kg");
  $(".goalTotalCo2").text(totalCo2 + "kg");

  $(".elec_total_name").text(elecCo2 + "kg");
  $(".gas_total_name").text(gasCo2 + "kg");
  $(".water_total_name").text(waterCo2 + "kg");
  $(".car_total_name").text(oilCo2 + "kg");
  $(".trash_total_name").text(trashCo2 + "kg");

  $(".elec_goal_name").text(elecCo2 + "kg");
  $(".gas_goal_name").text(gasCo2 + "kg");
  $(".water_goal_name").text(waterCo2 + "kg");
  $(".car_goal_name").text(oilCo2 + "kg");
  $(".trash_goal_name").text(trashCo2 + "kg");

  updateChartLengthBars();
}

function homeSubmit() {
  $("html, body").animate(
    {
      scrollTop: 0,
    },
    "fast"
  );
  var trashInput = document.getElementsByClassName("trash_usage");
  if (
    $(".elect_usage").val() == "" ||
    $(".gas_usage").val() == "" ||
    $(".water_usage").val() == "" ||
    ($('input[name="traffic_type"]:checked').attr("value") !== "3" && $(".oil_usage").val() == "") ||
    (trashInput[0].value === "" && trashInput[1].value === "")
  ) {
    alert("모든 칸을 입력해 주세요!");
    return false;
  }

  //결과보기로 이동
  insertOk = true;

  var elecCo2 = $(".DDCN_elect").val();
  var gasCo2 = $(".DDCN_gas").val();
  var waterCo2 = $(".DDCN_water").val();
  var oilCo2 = $(".DDCN_oil").val();
  var trashCo2 = $(".DDCN_trash").val();

  if (elecCo2 !== null && gasCo2 !== null && waterCo2 !== null && oilCo2 !== null && trashCo2 !== null) {
    drawDoughnutChartHousehold(elecCo2, gasCo2, waterCo2, oilCo2, trashCo2);
  }

  $("div.sub_menu_container ul.sub_menu_household li.household_one_step").removeClass("on");
  $(".title_info_box").css("display", "none");
  $("section.household_one_step").css({
    position: "fixed",
    "z-index": "-1",
    opacity: "0",
  });
  $("div.sub_menu_container ul.sub_menu_household li.household_two_step").addClass("on");
  $("section.household_two_step").css({
    position: "static",
    "z-index": "1",
    opacity: "1",
  });

  //저장 전 사용량 분석, 실천 목표, 종합평가 가리기
  $(".after").css("display", "none");
}

function homeSave() {
  var tansoType = "HOME";
  var trashType = "S";

  var targetUrl = "/tanso/insert_data2.green";

  var memberName = $("input[name=memberName1]").val();
  var memberHometype = $("input[name=housing_type]:checked").val();
  var memberHomesize = $("input[name=living_area]:checked").val();
  var memberHomefamily = Number($("input[name=living_person]:checked").val());
  var trafficType = $('input[name="traffic_type"]:checked').val();

  var elecUsed = $(".elect_usage").val();
  var gasUsed = $(".gas_usage").val();
  var waterUsed = $(".water_usage").val();
  var oilUsed = $(".oil_usage").val();
  var trashUsed = $(".trash_usage").val();
  var elecCo2 = $(".DDCN_elect").val();
  var gasCo2 = $(".DDCN_gas").val();
  var waterCo2 = $(".DDCN_water").val();
  var oilCo2 = $(".DDCN_oil").val();
  var trashCo2 = $(".DDCN_trash").val();
  var totalCo2 = $(".DDCN_total").val();
  var memberNameBase64 = btoa(unescape(encodeURIComponent(memberName)));
  var formData =
    "memberName=" +
    memberNameBase64 +
    "&usedElec=" +
    elecUsed +
    "&elecCo2=" +
    elecCo2 +
    "&usedGas=" +
    gasUsed +
    "&gasCo2=" +
    gasCo2 +
    "&usedWater=" +
    waterUsed +
    "&waterCo2=" +
    waterCo2 +
    "&usedCar=" +
    oilUsed +
    "&carCo2=" +
    oilCo2 +
    "&oilCar=" +
    trafficType +
    "&memberTotalCo2=" +
    totalCo2 +
    "&memberHometype=" +
    memberHometype +
    "&memberHomesize=" +
    memberHomesize +
    "&trashType=" +
    trashType +
    "&usedTrash=" +
    trashUsed +
    "&trashCo2=" +
    trashCo2 +
    "&tansoType=" +
    tansoType +
    "&memberHomefamily=" +
    memberHomefamily;

  if (resultIdx != 0) {
    targetUrl = "/tanso/update_data_new.green";
    formData += "&resultIdx=" + resultIdx;
  }

  console.log("eclipse", targetUrl, formData);
  $.ajax({
    url: targetUrl,
    data: formData,
    type: "POST",
    dataType: "json",
    contentType: "application/x-www-form-urlencoded;charset=EUC-KR",
    success: function (data) {
      resultIdx = data.resultIdx;

      var co2_total_avg = data.avgTotalCo2;
      var co2_elec_avg = data.avgElec;
      var co2_gas_avg = data.avgGas;
      var co2_water_avg = data.avgWater;
      var co2_car_avg = data.avgCar;
      var co2_trash_avg = data.avgTrash;

      $(".memberName").text(memberName);
      $(".totalCo2").text(totalCo2 + "kg");
      $(".partialCo2").text(elecCo2 + "kg");
      $(".partialCo2Goal").text(elecCo2 + "kg");
      $("car_total_name").text("0kg");
      $(".goalTotal").text("0kg");
      $(".partialCo2Avg").text(co2_elec_avg + "kg");

      var percent = data.avgTotalCo2Percent;
      if (percent >= 0) {
        $(".comparePer").text(percent + "% 더 많이 배출");
        $(".compareNum").text(calc(totalCo2 - co2_total_avg) + "kg");
      } else {
        $(".comparePer").text(percent + "% 더 적게 배출");
        $(".compareNum").text(calc(co2_total_avg - totalCo2) + "kg");
      }

      homeDraw(co2_total_avg, co2_elec_avg, co2_gas_avg, co2_water_avg, co2_car_avg, co2_trash_avg, elecCo2, gasCo2, waterCo2, oilCo2, trashCo2, totalCo2);
    },
  });

  updateChartLengthBars();
}

function homeDraw(co2_total_avg, co2_elec_avg, co2_gas_avg, co2_water_avg, co2_car_avg, co2_trash_avg, elecCo2, gasCo2, waterCo2, oilCo2, trashCo2, totalCo2) {
  //부문별 실천목표 그래프 처음에 0이 안나오게
  goalElec = elecCo2;
  goalGas = gasCo2;
  goalWater = waterCo2;
  goalOil = oilCo2;
  goalTrash = trashCo2;

  $(".avgTotalCo2").text(co2_total_avg + "kg");
  $(".goalTotalCo2").text(totalCo2 + "kg");

  $(".elec_total_name").text(elecCo2 + "kg");
  $(".gas_total_name").text(gasCo2 + "kg");
  $(".water_total_name").text(waterCo2 + "kg");
  $(".car_total_name").text(oilCo2 + "kg");
  $(".trash_total_name").text(trashCo2 + "kg");

  $(".elec_avg_name").text(co2_elec_avg + "kg");
  $(".gas_avg_name").text(co2_gas_avg + "kg");
  $(".water_avg_name").text(co2_water_avg + "kg");
  $(".car_avg_name").text(co2_car_avg + "kg");
  $(".trash_avg_name").text(co2_trash_avg + "kg");

  $(".elec_goal_name").text(elecCo2 + "kg");
  $(".gas_goal_name").text(gasCo2 + "kg");
  $(".water_goal_name").text(waterCo2 + "kg");
  $(".car_goal_name").text(oilCo2 + "kg");
  $(".trash_goal_name").text(trashCo2 + "kg");

  updateChartLengthBars();
}

function printNumber(target, num) {
  var intNum = [];
  var floatNum = 0;
  var stringNum = num;

  if (typeof stringNum === "string" && stringNum.indexOf(".") > -1) {
    var imsiNum = stringNum.split(".");
    floatNum = imsiNum[1];
    intNum = imsiNum[0].split("");
  } else if (typeof stringNum === "string") {
    intNum = stringNum.split("");
  }

  function updateLength(selector) {
    var start = 7 - intNum.length + 1;

    Array.from({ length: start - 1 }).forEach(function (_, i) {
      $(selector + " .input_number_length" + (i + 1)).val("");
    });

    intNum.forEach(function (digit) {
      $(selector + " .input_number_length" + start++).val(digit);
    });

    $(selector + " .input_number_length8").val(floatNum);
  }

  switch (target) {
    case "elecCo2":
      updateLength(".elecCo2");
      break;
    case "gasCo2":
      updateLength(".gasCo2");
      break;
    case "waterCo2":
      updateLength(".waterCo2");
      break;
    case "oilCo2":
      updateLength(".oilCo2");
      break;
    case "trashCo2":
      updateLength(".trashCo2");
      break;
    case "total_co2":
      updateLength(".total_co2");
      break;
  }
}

function total() {
  var elecCo2 = $(".DDCN_elect").val();
  var gasCo2 = $(".DDCN_gas").val();
  var waterCo2 = $(".DDCN_water").val();
  var oilCo2 = $(".DDCN_oil").val();
  var trashCo2 = $(".DDCN_trash").val();

  var totalCo2 = calc(parseFloat(elecCo2) + parseFloat(gasCo2) + parseFloat(waterCo2) + parseFloat(oilCo2) + parseFloat(trashCo2));
  $(".DDCN_total").val(totalCo2);
  printNumber("total_co2", totalCo2);
}

function checkCalc(c, classNm, num) {
  num = Number(num);
  if (c == "plus") {
    if (classNm.includes("elect")) {
      checkElec += num;
    } else if (classNm.includes("gas")) {
      checkGas += num;
    } else if (classNm.includes("water")) {
      checkWater += num;
    } else if (classNm.includes("traffic")) {
      checkOil += num;
    } else if (classNm.includes("trash")) {
      checkTrash += num;
    }
  } else if (c == "minus") {
    if (classNm.includes("elect")) {
      checkElec -= num;
    } else if (classNm.includes("gas")) {
      checkGas -= num;
    } else if (classNm.includes("water")) {
      checkWater -= num;
    } else if (classNm.includes("traffic")) {
      checkOil -= num;
    } else if (classNm.includes("trash")) {
      checkTrash -= num;
    }
  }

  var elecCo2 = $(".DDCN_elect").val();
  var gasCo2 = $(".DDCN_gas").val();
  var waterCo2 = $(".DDCN_water").val();
  var oilCo2 = $(".DDCN_oil").val();
  var trashCo2 = $(".DDCN_trash").val();
  var totalCo2 = $(".DDCN_total").val();

  var checkElecPer = 100 * (checkElec / 121);
  var checkGasPer = 100 * (checkGas / 121);
  var checkWaterPer = 100 * (checkWater / 121);
  var checkOilPer = 100 * (checkOil / 121);
  var checkTrashPer = 100 * (checkTrash / 121);
  var checkTotal = calc(checkElec + checkGas + checkWater + checkOil + checkTrash);
  var goalCo2 = totalCo2 > 0 ? calc(totalCo2 - checkTotal) : 0;

  $(".elec_chart").text(checkElec < 0 ? "0.0kg" : calc(checkElec) + "kg");
  $(".gas_chart").text(checkGas < 0 ? "0.0kg" : calc(checkGas) + "kg");
  $(".water_chart").text(checkWater < 0 ? "0.0kg" : calc(checkWater) + "kg");
  $(".traffic_chart").text(checkOil < 0 ? "0.0kg" : calc(checkOil) + "kg");
  $(".trash_chart").text(checkTrash < 0 ? "0.0kg" : calc(checkTrash) + "kg");
  $(".goalTotal").text(checkTotal < 0 ? "0.0kg" : calc(checkTotal) + "kg");
  $(".total_saving_nm").text(goalCo2 < 0 ? "0.0kg" : calc(goalCo2) + "kg");

  calculateTotalValue(classNm);

  $("elec_chart_bar")
    .stop()
    .css("width", "0px")
    .animate(
      {
        width: checkElecPer + "px",
      },
      400
    );
  $("gas_chart_bar")
    .stop()
    .css("width", "0px")
    .animate(
      {
        width: checkGasPer + "px",
      },
      400
    );
  $("water_chart_bar")
    .stop()
    .css("width", "0px")
    .animate(
      {
        width: checkWaterPer + "px",
      },
      400
    );
  $("traffic_chart_bar")
    .stop()
    .css("width", "0px")
    .animate(
      {
        width: checkOilPer + "px",
      },
      400
    );
  $("trash_chart_bar")
    .stop()
    .css("width", "0px")
    .animate(
      {
        width: checkTrashPer + "px",
      },
      400
    );

  goalElec = calc(elecCo2 - checkElec) < 0 ? 0 : calc(elecCo2 - checkElec);
  goalGas = calc(gasCo2 - checkGas) < 0 ? 0 : calc(gasCo2 - checkGas);
  goalWater = calc(waterCo2 - checkWater) < 0 ? 0 : calc(waterCo2 - checkWater);
  goalOil = calc(oilCo2 - checkOil) < 0 ? 0 : calc(oilCo2 - checkOil);
  goalTrash = calc(trashCo2 - checkTrash) < 0 ? 0 : calc(trashCo2 - checkTrash);

  $(".elec_goal_name").text(goalElec + "kg");
  $(".gas_goal_name").text(goalGas + "kg");
  $(".water_goal_name").text(goalWater + "kg");
  $(".car_goal_name").text(goalOil + "kg");
  $(".trash_goal_name").text(goalTrash + "kg");
  $(".goalTotalCo2").text(goalCo2 + "kg");

  updateChartLengthBars();
}

const createTooltip = (chart) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";
    tooltipEl.style.fontSize = "13px"; // 툴팁 라벨의 글자 크기

    const table = document.createElement("table");
    table.style.margin = "0px";

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const tooltipHandler = (context) => {
  const { chart, tooltip } = context;
  const tooltipEl = createTooltip(chart);

  if (tooltip.opacity === 0) {
    tooltipEl.style.display = "none";
    return;
  } else {
    tooltipEl.style.display = "block";
  }
  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b) => b.lines);

    const tableHead = document.createElement("thead");

    titleLines.forEach((title) => {
      const tr = document.createElement("tr");
      tr.style.borderWidth = 0;

      const th = document.createElement("th");
      th.style.borderWidth = 0;
      th.style.fontSize = "18px";
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement("tbody");
    bodyLines.forEach((body, i) => {
      const containerDiv = document.createElement("div");
      containerDiv.style.width = "148px";
      containerDiv.style.padding = "12px 16px";
      containerDiv.style.border = "1px solid #E8EBED";
      containerDiv.style.background = "#fff";
      containerDiv.style.borderRadius = "3px";

      const colors = tooltip.labelColors[i];
      const span1 = document.createElement("span");
      span1.style.display = "flex";
      span1.style.width = "100%";
      span1.style.justifyContent = "flex-start";
      span1.style.color = colors.backgroundColor;
      span1.style.fontSize = "14px";
      span1.style.fontWeight = "700";
      const label = document.createTextNode(tooltip.dataPoints[i].label);
      span1.appendChild(label);
      span1.style.background = "#fff";
      span1.style.borderRadius = "12px";
      span1.style.float = "left";

      const span2 = document.createElement("span");
      span2.style.display = "flex";
      span2.style.width = "100%";
      span2.style.justifyContent = "flex-end";
      span2.style.color = colors.backgroundColor;
      span2.style.fontSize = "18px";
      span2.style.fontWeight = "700";
      span2.style.textAlign = "right";
      span2.style.float = "right";

      const stringValue = body[0].substring(body[0].indexOf(":") + 1).trim();
      const numericValue = parseFloat(stringValue.replace(/,/g, "")).toFixed(1);

      const textNode = document.createTextNode(numericValue);
      const unitTextNode = document.createTextNode(" kg/월");

      span2.appendChild(textNode);
      span2.appendChild(unitTextNode);

      containerDiv.appendChild(span1);
      containerDiv.appendChild(span2);

      document.body.appendChild(containerDiv);

      const tr = document.createElement("tr");
      tr.style.backgroundColor = "inherit";
      tr.style.borderWidth = 0;

      const td = document.createElement("td");
      td.style.borderWidth = 0;
      td.style.position = "relative";
      td.style.display = "flex";
      td.style.flexDirection = "column";
      td.style.alignItems = "center";
      td.style.width = "100%";
      td.classList.add("chart_modal_bg");

      const chartBg = document.createElement("img");
      chartBg.src = "/tanso2023/dist/images/chart_modal_polygon.svg";
      chartBg.alt = "차트 호버시 나타나는 창 밑의 삼각형";

      chartBg.style.transform = "translateY(-3px)";
      chartBg.style.zIndex = "-1";
      /* chartBg.style.position = 'absolute';
            chartBg.style.left = '50%';
            chartBg.style.bottom = '-25px';
            chartBg.style.transform = 'translateX(-50%)';
            chartBg.style.zIndex = '-99';
			*/

      td.appendChild(containerDiv);
      td.appendChild(chartBg);
      tr.appendChild(td);
      tableBody.appendChild(tr);
    });

    const tableRoot = tooltipEl.querySelector("table");

    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = tooltip.options.padding + "px " + tooltip.options.padding + "px";
};

/* 차트 */
function drawDoughnutChartBusiness(elecCo2, gasCo2, waterCo2, oilCo2, trashCo2) {
  var ctx = document.getElementById("myDoughnutChart").getContext("2d");

  Chart.register(ChartDataLabels);
  /* 호버시 나타나는 툴팁 포지션 */
  Chart.Tooltip.positioners.custom = function (elements, position) {
    if (!elements.length) {
      return false;
    }
    const offsetY = -100;
    return {
      x: position.x,
      y: position.y + offsetY,
    };
  };
  Chart.defaults.set("plugins.datalabels", {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "500",
    formatter: function (value) {
      return value + " kg";
    },
  });

  var myDoughnutChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["전기", "가스", "수도", "교통", "폐기물"],
      datasets: [
        {
          data: [calc(elecCo2), calc(gasCo2), calc(waterCo2), calc(oilCo2), calc(trashCo2)],
          backgroundColor: ["#6C9BF7", "#FE7713", "#AC75FD", "#FE5A82", "#4ACC9C"],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      animation: {
        animateRotate: true,
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "mid",
          fullWidth: true,
          labels: {
            usePointStyle: true,
            fontSize: 10,
          },
        },
        tooltip: {
          enabled: false,
          position: "custom",
          external: tooltipHandler,
        },
      },
    },
  });

  /* 이미지 */
  var ctx2 = document.getElementById("myDoughnutChart2").getContext("2d");
  var myDoughnutChart2 = new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: ["전기", "가스", "수도", "교통", "폐기물"],
      datasets: [
        {
          data: [calc(elecCo2), calc(gasCo2), calc(waterCo2), calc(oilCo2), calc(trashCo2)],
          backgroundColor: ["#6C9BF7", "#FE7713", "#AC75FD", "#FE5A82", "#4ACC9C"],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      animation: {
        animateRotate: true,
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "mid",
          fullWidth: true,
          labels: {
            usePointStyle: true,
            fontSize: 10,
          },
        },
      },
    },
  });
}

function drawDoughnutChartHousehold(elecCo2, gasCo2, waterCo2, oilCo2, trashCo2) {
  /* 가정용 */
  var ctx3 = document.getElementById("myDoughnutChart3").getContext("2d");

  Chart.register(ChartDataLabels);

  Chart.Tooltip.positioners.custom = function (elements, position) {
    if (!elements.length) {
      return false;
    }
    const offsetY = -100;
    return {
      x: position.x,
      y: position.y + offsetY,
    };
  };
  Chart.defaults.set("plugins.datalabels", {
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "500",
    formatter: function (value) {
      return value + " kg";
    },
  });

  var myDoughnutChart3 = new Chart(ctx3, {
    type: "doughnut",
    data: {
      labels: ["전기", "가스", "수도", "교통", "폐기물"],
      datasets: [
        {
          data: [calc(elecCo2), calc(gasCo2), calc(waterCo2), calc(oilCo2), calc(trashCo2)],
          backgroundColor: ["#6C9BF7", "#FE7713", "#AC75FD", "#FE5A82", "#4ACC9C"],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      animation: {
        animateRotate: true,
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "mid",
          fullWidth: true,
          labels: {
            usePointStyle: true,
            fontSize: 10,
          },
        },
        tooltip: {
          enabled: false,
          position: "custom",
          external: tooltipHandler,
        },
      },
    },
  });

  /* 이미지 */
  var ctx4 = document.getElementById("myDoughnutChart4").getContext("2d");
  var myDoughnutChart4 = new Chart(ctx4, {
    type: "doughnut",
    data: {
      labels: ["전기", "가스", "수도", "교통", "폐기물"],
      datasets: [
        {
          data: [calc(elecCo2), calc(gasCo2), calc(waterCo2), calc(oilCo2), calc(trashCo2)],
          backgroundColor: ["#6C9BF7", "#FE7713", "#AC75FD", "#FE5A82", "#4ACC9C"],
          hoverOffset: 4,
        },
      ],
    },
    options: {
      animation: {
        animateRotate: true,
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          align: "mid",
          fullWidth: true,
          labels: {
            usePointStyle: true,
            fontSize: 10,
          },
        },
      },
    },
  });
}

/* header event */
$(document).ready(function () {
  $(".header_drop_toggle_btn").click(function () {
    $(".header_right_box_mobile_drop").slideToggle();
  });
});
