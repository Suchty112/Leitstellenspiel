// ==UserScript==
// @name         autm. werben Button
// @version      1.0.0
// @description  fuegt einen zusaetzlichen Button auf der Seite -neues Personal werben- hinzu
// @author       DrTraxx
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com)\/buildings\/.*\/hire$/
// @grant        none
// ==/UserScript==
/* global $ */

(function() {
    'use strict';

    var buildingId = $('#back_to_personals').attr('href').replace('/buildings/','').replace('/personals','');

    $("a[href*='/hire_do/3']").after(`<a href="/buildings/${buildingId}/hire_do/automatic" class="btn btn-default">automatisch werben</a`);

})();
