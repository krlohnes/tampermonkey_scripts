// ==UserScript==
// @name         Dominion Notifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*dominion.games/
// @grant GM_notification
// @grant GM_openInTab
// @grant window.focus
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';
    var previous = "You may";
    var hasFocus = true;
    window.onfocus = () => hasFocus = true;
	window.onblur = () => hasFocus = false;
    var interval;
    function notification(title) {
        GM_notification({
            title: title,
            text: "Dominion Online",
            onclick: () => GM_openInTab(window.location.href, true),
            image: "http://wiki.dominionstrategy.com/skins/common/images/dslogo.png",
            timeout: 40000
        });
    }
    function notify() {
        let storylineText = $('.storyline').text();
        var containsTurnText = storylineText.includes("You may") || storylineText.includes("Discard");
        if (containsTurnText && (!previous.includes("You may") || !previous.includes("Discard")) && !hasFocus) {
          notification("It's your turn on Dominion online");
          setInterval(() => {
              let storylineTextInt = $('.storyline').text();
              if ((storyLineTextInt.includes("You may") || storyLineTextInt.includes("Discard")) && !hasFocus) {
                notification("Just a reminder, it's your turn in Dominion online");
              } else if (interval) {
                clearInterval(interval);
                interval = null;
              }
          }, 600000);
        }
        if (!containsTurnText && interval) {
            clearInterval(interval);
            interval = null;
        }
        previous = $('.storyline').text();
    }
    $('.storyline').ready(() => {
        notify();
        setInterval(notify, 1000);
    });
    $(".storyline").on('DOMSubtreeModified', function () {
        alert("Span HTML is now " + $(this).html());
    });
})();
