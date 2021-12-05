import $ from 'jquery';
import 'bootstrap-honoka/dist/js/bootstrap.bundle';
import 'pickadate/lib/picker';
import 'pickadate/lib/picker.date';
//import 'pickadate/lib/picker.time';
import * as holiday_jp from '@holiday-jp/holiday_jp';

/**
 * weekdayJP
 *
 * description: 曜日の数値から日本語の曜日名を返す
 *
 * @param {int} week : 曜日の数値 (0～6)
 *
 * @returns {string} : 日～土の文字列
 */
const weekdayJP = (week) => {
    switch (week) {
        case 0:
            return '日';
        case 1:
            return '月';
        case 2:
            return '火';
        case 3:
            return '水';
        case 4:
            return '木';
        case 5:
            return '金';
        case 6:
            return '土';
        default:
            return '';
    }
};

/**
 * holidaiesList
 *
 * description : 本日の3日後～来年末までの祝日を取得
 *
 * @param {Object} date4PD   : Dateオブジェクト
 *
 * @return {Array} : 祝日の年月日の配列の配列
 */
const holidaiesList = (date4PD) => {
    const holiday = holiday_jp.between(date4PD, new Date(date4PD.getFullYear() + 1, 11, 31));
    const holidayList = holiday.map((elm) => [
            elm.date.getFullYear(),
            elm.date.getMonth(),
            elm.date.getDate()
        ]
    );
    return holidayList;
};

$(() => {
    const today = new Date();
    const $datepicker = $('#datepick');
    // placeholder
    $datepicker.attr('placeholder', `${today.getFullYear()}年${(today.getMonth() + 1).toString()}月${today.getDate()}日(${weekdayJP(today.getDay())})`);
    // datepicker
    const date4PD = new Date();
    date4PD.setDate(date4PD.getDate() + 3); // 3日後に設定
    // 本日の3日後～来年末までの祝日を取得
    const holidaiesArray = holidaiesList(date4PD);
    const nowYear = today.getFullYear();
    // 決め打ちの日
    const specificDate = {
        year: 2017,
        month: 1,
        date: 13,
    };
    const disableDateSpecific = [
        {
            from: [
                nowYear,
                0,
                1,
            ],
            to: [
                nowYear,
                0,
                3,
            ]
        }, // 正月三が日
        [
            nowYear,
            specificDate.month,
            specificDate.date,
        ], // 決め打ちの日
        {
            from: [
                nowYear + 1,
                0,
                1,
            ],
            to: [
                nowYear + 1,
                0,
                3,
            ]
        }, // 正月三が日 (翌年)
        [
            nowYear + 1,
            specificDate.month,
            specificDate.date,
        ], // 決め打ちの日
        1, // 日曜日
        7, // 土曜日
    ];
    const disableDate = disableDateSpecific.concat(holidaiesArray); // 決め打ちの日 (今年, 翌年) + 日曜日 + 祝日 (今年, 翌年)

    $.extend(
        $.fn.pickadate.defaults,
        {
            monthsFull: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月'
            ],
            monthsShort: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月'
            ],
            weekdaysFull: [
                '日',
                '月',
                '火',
                '水',
                '木',
                '金',
                '土'
            ],
            weekdaysShort: [
                '日',
                '月',
                '火',
                '水',
                '木',
                '金',
                '土'
            ],
            today: '本日',
            clear: 'キャンセル',
            close: '閉じる',
            format: 'yyyy年mm月dd日(ddd)',
            min: [
                date4PD.getFullYear(),
                date4PD.getMonth(),
                date4PD.getDate()
            ],
            max: [
                date4PD.getFullYear() + 1,
                date4PD.getMonth(),
                date4PD.getDate()
            ],
            disable: disableDate,
        }
    );
    $datepicker.pickadate();
});
