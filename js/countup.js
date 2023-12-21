(function ($) {
  "use strict";
  /************************************************************************************
 * Gw's JQuery CountUP Plugin 
 *  - 작성 날자 : 2023-12-21
 *  - 게으른 퍼블리셔의 제이쿼리 카운트업 플러그인
 *  - 수많은 버그가 있을 수 있음. ( 자주 사용할만한 옵션들 위주로 작성. )
 *  - DISCLAIMER : 영리 목적으로 사용해도 되지만 뻑이 갔을 때 나는 책임 지지 노노
 *  - 버전관리
 * ---1번째 자리 : 코드 새롭게 작성할때
 * ---2번째 자리 : 코드 간결화
 * ---3번째 자리 : 옵션추가
 * @author Kim Gun Woo & ChatGPT
 * @version 1.0.1
 ************************************************************************************/

  $.fn.count = function (options) {
    //옵션 디폴트 세팅
    var settings = $.extend({
      duration: 2000, // 작동시간
      delay:0, // 몇초뒤에 시작할건지 딜레이
      start: 0, // 몇부터 시작할건지
      decimalPlaces: 0, // 소수점을 몇자리 까지 출력할건지.
      offset: '100%', // 100% - 화면에 들어왔을때 실행 
      triggerOnce: false, // 한번만 실행 될건지
      end: null, // 끝나는 지점 ex 숫자가 1 이라면 숫자가 멈춰있는것처럼 보이기 때문에 크게 지정 후 콜백함수로 마지막에 text를 1로 변경
      onStart: function () {}, // 시작하기 전 시작될 콜백함수
      onLeave: function () {} // 완료 후 진행될 콜백함수
    }, options);

    $(this).each(function () {
      var $this = $(this);
      // 옵션의 end 값을 넣어주었다면 ? settings.end로 : end값이 없다면 내가 지정한 숫자로
      var target = settings.end !== null ? settings.end : parseInt($this.text());
      var count = settings.start;
      var countUp;



      //처음 시작 숫자를 0부터
      $this.text(0);
      
  
      // Waypoint.js를 사용하여 offset 옵션 추가
      // 옵션으로 설정한 start 부터 target 인 end(count의 숫자)만큼 애니메이션이 동작
      countUp = function() {
        $({ count: settings.start }).delay(settings.delay).animate({ count: target }, {
          duration: settings.duration, // 옵션으로 설정한 애니메이션 작동 시간을 가져옴
          step: function () { // 애니메이션이 동작하는 스텝마다 숫자를 1씩 올림
            $this.text(formatNumber(this.count, settings.decimalPlaces));
          },
          complete: function () {
            $this.text(formatNumber(target, settings.decimalPlaces));
            // 애니메이션이(카운트업) 끝난 후 콜백함수 실행
            settings.onLeave();
          }
        });
        // 시작 전에 콜백함수 실행
        settings.onStart(); 
      };

      // 콤마 추가
      // function addCommas(number) {
      //   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      // }

      // 숫자에 콤마 및 지정된 소수점 자리수를 포함하여 형식을 지정하는 함수
      function formatNumber(number, decimalPlaces) {
        // 소수점 자리수에 따라 숫자를 형식화하고, 콤마를 추가
        var formattedNumber = number.toFixed(decimalPlaces);
        return formattedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      
      $this.waypoint({
        handler: function (direction) {
          if (direction === 'down') {
            countUp();
          }
        },
        offset: settings.offset,
        triggerOnce: true
      });
    });
  };

}(jQuery));