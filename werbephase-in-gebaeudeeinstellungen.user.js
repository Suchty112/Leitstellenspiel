// ==UserScript==
// @name         Werbephasen in Gebaeudeeinstellungen
// @version      1.0.0
// @description  Werbephasen in den Gebaeudeeinstellungen auswählen
// @author       DrTraxx
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com)\/buildings\/.*\/edit$/
// @grant        none
// ==/UserScript==
/* global $ */

(function() {
    'use strict';

    var buildingId = $('#back_to_building').attr('href').replace('/buildings/','');

    $("input[value*='Speichern']").after(`<a href="/buildings/${buildingId}/hire_do/1" class="btn btn-default">1 Tag werben</a>`);
    $("a[href*='hire_do/1']").after(`<a href="/buildings/${buildingId}/hire_do/2" class="btn btn-default">2 Tage werben</a>`);
    $("a[href*='hire_do/2']").after(`<a href="/buildings/${buildingId}/hire_do/3" class="btn btn-default">3 Tage werben</a>`);
    if(user_premium == true){
        $("a[href*='hire_do/3']").after(`<a href="/buildings/${buildingId}/hire_do/automatic" class="btn btn-default">automatisch</a>`);
    }
    
})();
