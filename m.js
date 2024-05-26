const fs = require('graceful-fs')
const fsx = require('fs')
const https = require('https');
const http = require('http');
const axios = require('axios')
const express = require('express')
const moment = require('moment-timezone');
const istanbulZamani = moment.tz('Europe/Istanbul');
/*
let options = {
  key: fs.readFileSync('/var/www/vhosts/tiktokajansi.com/tiktokext/ssl/ssl_private-key.key'), // Özel anahtar dosyasının yolu
  cert: fs.readFileSync('/var/www/vhosts/tiktokajansi.com/tiktokext/ssl/ssl_ssl-certificate.crt'), // Sertifika dosyasının yolu
};*/
let options = {
  key: fs.readFileSync('./ssl/ssl_private-key.key'),
  cert: fs.readFileSync('./ssl/ssl_ssl-certificate.crt')
}
var cors = require('cors')
const rateLimit = require('express-rate-limit')
const app = express()
app.use(cors())
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: 'rate_limit',
  // store: ... , // Use an external store for consistency across multiple server instances.
})
app.use(limiter)

const cookie1 = '_ttp=2SSs6ol6OTyeBBmShZnLupo0tnA; tt_chain_token=ANhxo356nSOyfyU/ieRfRg==; passport_csrf_token=1055bc7682bc6f892128cdbeecee4f8d; passport_csrf_token_default=1055bc7682bc6f892128cdbeecee4f8d; tta_attr_id=0.1696859584.7287956417879752706; tta_attr_id_mirror=0.1696859584.7287956417879752706; _ga=GA1.1.200874198.1696859586; passport_auth_status=dab3f814098a7d0cc7ccdaf4cd043af1%2C; passport_auth_status_ss=dab3f814098a7d0cc7ccdaf4cd043af1%2C; passport_auth_status_ads=e7ce2ad495760e3bf36b591455e07a8c%2C; passport_auth_status_ss_ads=e7ce2ad495760e3bf36b591455e07a8c%2C; _ga_HV1FL86553=GS1.1.1696859586.1.1.1696859679.48.0.0; from_way=paid; _gcl_aw=GCL.1696859759.CjwKCAjwyY6pBhA9EiwAMzmfwbJI9-pSKuTT3rkmWzscLWWNDgqoxY-MIdMDze0Vx1hSWoT1gfAqohoCC3kQAvD_BwE; _gcl_au=1.1.1135788866.1696859759; _fbp=fb.1.1696859760339.1378777663; _rdt_uuid=1696859761025.25962036-2ba5-4903-97bd-4935274ce637; _tt_enable_cookie=1; sid_guard_ads=0f8b836105b96700f8f0e0f11967014c%7C1696859771%7C863905%7CThu%2C+19-Oct-2023+13%3A54%3A36+GMT; _uetvid=93c6b5a066ab11ee9ae02b495ff97f90; _ga_R5EYE54KWQ=GS1.1.1696859759.1.1.1696859958.60.0.0; tiktok_webapp_theme=dark; __tea_cache_tokens_1988={%22user_unique_id%22:%227222353024403834369%22%2C%22timestamp%22:1696860327181%2C%22_type_%22:%22default%22}; tt_csrf_token=I9zPxf10-8s3wFmZ4opwon-oqwuyQ2ri34uk; living_user_id=840753504572; csrfToken=iv7YGtQf-RZFpJf6Yg5OCJcL8lB3pgp2baUA; s_v_web_id=verify_loa4mlwm_3y85QkrP_mifd_410q_9eFc_awZzI4d2bZCn; d_ticket=76a0811fcefec14f8ac17db6a97df715807fd; multi_sids=7188647735992632325%3A0088977c64d264f2014dfcfa13970e43; cmpl_token=AgQQAPOGF-RO0rP926DXcx08_ltq_PGQP4MJYMxh3w; sid_guard=0088977c64d264f2014dfcfa13970e43%7C1698588239%7C15551999%7CFri%2C+26-Apr-2024+14%3A03%3A58+GMT; uid_tt=565474b1b699f0210082ca599e16787a10fca63476443b63f95e56219f3b8dbd; uid_tt_ss=565474b1b699f0210082ca599e16787a10fca63476443b63f95e56219f3b8dbd; sid_tt=0088977c64d264f2014dfcfa13970e43; sessionid=0088977c64d264f2014dfcfa13970e43; sessionid_ss=0088977c64d264f2014dfcfa13970e43; sid_ucp_v1=1.0.0-KDM2MDhlODJlYTQzYTUyNzdlMWVmM2U5ODdmNjA1MjU3YzNjZjhjMmMKIAiFiIf69aDN4WMQz8z5qQYYswsgDDCm6oyeBjgEQOoHEAMaBm1hbGl2YSIgMDA4ODk3N2M2NGQyNjRmMjAxNGRmY2ZhMTM5NzBlNDM; ssid_ucp_v1=1.0.0-KDM2MDhlODJlYTQzYTUyNzdlMWVmM2U5ODdmNjA1MjU3YzNjZjhjMmMKIAiFiIf69aDN4WMQz8z5qQYYswsgDDCm6oyeBjgEQOoHEAMaBm1hbGl2YSIgMDA4ODk3N2M2NGQyNjRmMjAxNGRmY2ZhMTM5NzBlNDM; store-idc=maliva; store-country-code=tr; store-country-code-src=uid; tt-target-idc=useast1a; tt-target-idc-sign=QhxuCN8wA_E3WmgiFSZHMk-sa3u2bAEGqBWCjgcHFQEWDeMZ6FhDG6i39ZfkDFdS1C4Vouo6UjOr7mN7ES9O9HGgFqB7fm52q1YxlTnrNHr1IK4EHdXYA_DK7O6tuHcvZfEbI7d_iiJrCIwj_7L5l8MnuIxnPeJfx2gjnRh9UnRHNejWYVsj-d2NkkmAosdRr3clI_UXoGoaYdgc6weRS74Sm98DeJpMH4LYCoyLtl3FYMq1EpIWMxdh4zwQevu4hxUKQtELueQAZZUgXfxd9sS3Qt3PWcYIUt9RIpEHWXeSdV18ke-5GL817K9mpfQ_Th6_laqGfQAMU4DL3p0NGfryugeaszqfc-_xLBblVB7E0qkOs5vFMOvBRFLM5o7fIoBf78ThK_wEkwmpP6T1WKz1XOMZXEAcdY9g6z-N2tkb_-8XkW6M4Z09t0n6t_C2WuY0IhCPBRUnDoFLjYPql8kbmDToiOdlQnoijPoe_ksZqXP1FRoIXKCHOQodXqWK; passport_fe_beating_status=true; ttwid=1%7CmP6sQIXwx9nr3Fi0VFzUAznaZwVmz_NlYp3OvgqAX80%7C1698588266%7C3db49c4f2b9d59bd96420a27959bba20533f88d584856e0dcd128ab3a67e0995; odin_tt=3fa9f61a255f164f37aadcc3c876b6de55681c4e886fda77ae939880e354788af40eb7a203bb0bd55ab3cd348fdf99ba65e474ee5ee50292219797e10e88096878b540b7606fabbd670687c5c79b88ab; tea_sid=c7f5963d-8c93-4a8a-8b11-b399bb4681db; msToken=1_gqRXdOKsATsJ9d_pMBXBwcesjwTIeItlIXVNOkoLJBok2L59DAoxklVi4KUQdHgYiJi8NfGuFJQyjo8hyB-vJJqQOcuPyqLrZHdJNpS4sZjHudfa6v9w5yIcyzjgTvgAwRLQ2YsZG0cZ6z; msToken=1_gqRXdOKsATsJ9d_pMBXBwcesjwTIeItlIXVNOkoLJBok2L59DAoxklVi4KUQdHgYiJi8NfGuFJQyjo8hyB-vJJqQOcuPyqLrZHdJNpS4sZjHudfa6v9w5yIcyzjgTvgAwRLQ2YsZG0cZ6z'
const cookie2 = '_ttp=2SSs6ol6OTyeBBmShZnLupo0tnA; tt_chain_token=ANhxo356nSOyfyU/ieRfRg==; passport_csrf_token=1055bc7682bc6f892128cdbeecee4f8d; passport_csrf_token_default=1055bc7682bc6f892128cdbeecee4f8d; tta_attr_id=0.1696859584.7287956417879752706; tta_attr_id_mirror=0.1696859584.7287956417879752706; _ga=GA1.1.200874198.1696859586; passport_auth_status=dab3f814098a7d0cc7ccdaf4cd043af1%2C; passport_auth_status_ss=dab3f814098a7d0cc7ccdaf4cd043af1%2C; passport_auth_status_ads=e7ce2ad495760e3bf36b591455e07a8c%2C; passport_auth_status_ss_ads=e7ce2ad495760e3bf36b591455e07a8c%2C; _ga_HV1FL86553=GS1.1.1696859586.1.1.1696859679.48.0.0; from_way=paid; _gcl_aw=GCL.1696859759.CjwKCAjwyY6pBhA9EiwAMzmfwbJI9-pSKuTT3rkmWzscLWWNDgqoxY-MIdMDze0Vx1hSWoT1gfAqohoCC3kQAvD_BwE; _gcl_au=1.1.1135788866.1696859759; _fbp=fb.1.1696859760339.1378777663; _rdt_uuid=1696859761025.25962036-2ba5-4903-97bd-4935274ce637; _tt_enable_cookie=1; sid_guard_ads=0f8b836105b96700f8f0e0f11967014c%7C1696859771%7C863905%7CThu%2C+19-Oct-2023+13%3A54%3A36+GMT; _uetvid=93c6b5a066ab11ee9ae02b495ff97f90; _ga_R5EYE54KWQ=GS1.1.1696859759.1.1.1696859958.60.0.0; tt_csrf_token=I9zPxf10-8s3wFmZ4opwon-oqwuyQ2ri34uk; csrf_session_id=e49af2be19609e79d1b69230682b06b3; csrfToken=iv7YGtQf-RZFpJf6Yg5OCJcL8lB3pgp2baUA; s_v_web_id=verify_loa4mlwm_3y85QkrP_mifd_410q_9eFc_awZzI4d2bZCn; d_ticket=76a0811fcefec14f8ac17db6a97df715807fd; multi_sids=7188647735992632325%3A0088977c64d264f2014dfcfa13970e43; cmpl_token=AgQQAPOGF-RO0rP926DXcx08_ltq_PGQP4MJYMxh3w; sid_guard=0088977c64d264f2014dfcfa13970e43%7C1698588239%7C15551999%7CFri%2C+26-Apr-2024+14%3A03%3A58+GMT; uid_tt=565474b1b699f0210082ca599e16787a10fca63476443b63f95e56219f3b8dbd; uid_tt_ss=565474b1b699f0210082ca599e16787a10fca63476443b63f95e56219f3b8dbd; sid_tt=0088977c64d264f2014dfcfa13970e43; sessionid=0088977c64d264f2014dfcfa13970e43; sessionid_ss=0088977c64d264f2014dfcfa13970e43; sid_ucp_v1=1.0.0-KDM2MDhlODJlYTQzYTUyNzdlMWVmM2U5ODdmNjA1MjU3YzNjZjhjMmMKIAiFiIf69aDN4WMQz8z5qQYYswsgDDCm6oyeBjgEQOoHEAMaBm1hbGl2YSIgMDA4ODk3N2M2NGQyNjRmMjAxNGRmY2ZhMTM5NzBlNDM; ssid_ucp_v1=1.0.0-KDM2MDhlODJlYTQzYTUyNzdlMWVmM2U5ODdmNjA1MjU3YzNjZjhjMmMKIAiFiIf69aDN4WMQz8z5qQYYswsgDDCm6oyeBjgEQOoHEAMaBm1hbGl2YSIgMDA4ODk3N2M2NGQyNjRmMjAxNGRmY2ZhMTM5NzBlNDM; store-idc=maliva; store-country-code=tr; store-country-code-src=uid; tt-target-idc=useast1a; tt-target-idc-sign=QhxuCN8wA_E3WmgiFSZHMk-sa3u2bAEGqBWCjgcHFQEWDeMZ6FhDG6i39ZfkDFdS1C4Vouo6UjOr7mN7ES9O9HGgFqB7fm52q1YxlTnrNHr1IK4EHdXYA_DK7O6tuHcvZfEbI7d_iiJrCIwj_7L5l8MnuIxnPeJfx2gjnRh9UnRHNejWYVsj-d2NkkmAosdRr3clI_UXoGoaYdgc6weRS74Sm98DeJpMH4LYCoyLtl3FYMq1EpIWMxdh4zwQevu4hxUKQtELueQAZZUgXfxd9sS3Qt3PWcYIUt9RIpEHWXeSdV18ke-5GL817K9mpfQ_Th6_laqGfQAMU4DL3p0NGfryugeaszqfc-_xLBblVB7E0qkOs5vFMOvBRFLM5o7fIoBf78ThK_wEkwmpP6T1WKz1XOMZXEAcdY9g6z-N2tkb_-8XkW6M4Z09t0n6t_C2WuY0IhCPBRUnDoFLjYPql8kbmDToiOdlQnoijPoe_ksZqXP1FRoIXKCHOQodXqWK; ttwid=1%7CmP6sQIXwx9nr3Fi0VFzUAznaZwVmz_NlYp3OvgqAX80%7C1698588659%7Cf6d4d826e5843840baf3d4748671767cba5d934579a04c66003740ee2913e902; odin_tt=2e63b65492f3aa8a91aa7adbe313745da3b884b4969c4548337d1eedf3a74b7dd4f8fddad7b44fabb34b1fa4541bc1bb61eb4b1c446f540f1d00d13ccdbc1a99fec25ca36ee9c90edf012d265d54c0d3; msToken=c3qNrH9J8CrKnFMMAtNA0UTvrWbAY-BVPM1ndfgoYh0wkMSk6f-fbEakkv1MKxgVzusMZM-nApxyGS94UFu2g9BuXKnFnxuGlim0-NtzTqski6tynb6IQehjMLCOFN78XQ61CIsUNiImJLdGEA=='
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'

function checkTotal(streamers, limit) {
  return [...new Set(streamers.splice(0, limit))];
}

function licenseCheck(licenseKey) {
  var licenses = JSON.parse(fs.readFileSync('licenses.json'))
  var licenseKeys = Object.keys(licenses)
  if (-1 == licenseKeys.indexOf(licenseKey)) {
    return 'license_not_exist'
  }

  if (!licenses[licenseKeys].status) {
    return 'license_not_activated'
  }

  const timeZone = 'Asia/Bangkok'; // Europe/Istanbul
  const date1 = new Date().toLocaleString('en-US', { timeZone });
  const currentUnix = Math.floor(new Date(date1).getTime() / 1000);

  const expireUnix = Date.parse(licenses[licenseKeys].time) / 1000;

  if (currentUnix >= expireUnix - 25200) { //10800
    return 'license_expired'
  }

  return 'license_active'
}

var streamers = []
async function fetchStreamers(count, ...func_params) {
  //console.log(count);
  var searchType = func_params[0]
  var searchParam = func_params[1]
  var onlineThreshold = func_params[2]
  var streamerLimit = func_params[3]
  onlineThreshold = parseInt(onlineThreshold)
  return new Promise(async (resolve) => {
    if (streamerLimit / 12 + 1 <= count) {
      resolve(checkTotal(streamers, streamerLimit))
      return
    }
    if ('keyword' == searchType) {
      const response = await axios.get('https://www.tiktok.com/api/search/live/full/', {
        params: {
          'WebIdLastTime': '1681285332',
          'aid': '1988',
          'app_language': 'tr',
          'app_name': 'tiktok_web',
          'browser_language': 'tr-TR',
          'browser_name': 'Mozilla',
          'browser_online': 'true',
          'browser_platform': 'MacIntel',
          'browser_version': userAgent.slice(8),
          'channel': 'tiktok_web',
          'cookie_enabled': 'true',
          'count': '12',
          'device_id': '7384723847387473847',
          'device_platform': 'web_pc',
          'device_type': 'web_h265',
          'focus_state': 'false',
          'from_page': 'search',
          'history_len': '4',
          'is_fullscreen': 'false',
          'is_page_visible': 'true',
          'keyword': searchParam,
          'offset': count * 12,
          'os': 'mac',
          'priority_region': 'TR',
          'referer': 'https://www.tiktok.com/search/live?t=' + Date.now(),
          'region': 'TR',
          'root_referer': 'https://www.tiktok.com/search/live?t=' + Date.now(),
          'screen_height': '1920',
          'screen_width': '1080',
          'search_id': '2023102914042745F19BF079AE08C4B197',
          'verifyFp': 'verify_loa4mlwm_3y85QkrP_mifd_410q_9eFc_awZzI4d2bZCn',
          'tz_name': 'Europe/Istanbul',
          'web_search_code': '{"tiktok":{"client_params_x":{"search_engine":{"ies_mt_user_live_video_card_use_libra":1,"mt_search_general_user_live_card":1}},"search_server":{}}}',
          'webcast_language': 'en'
        },
        headers: {
          'authority': 'www.tiktok.com',
          'accept': '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cookie': cookie1,
          'referer': 'https://www.tiktok.com/search/live?t=' + Date.now(),
          'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'user-agent': userAgent
        }
      });

      // finished
      if ('undefined' == typeof response.data.data) {
        resolve(checkTotal(streamers, streamerLimit))
        return
      }

      response.data.data.forEach(val => {
        var data = JSON.parse(val.live_info.raw_data)
        //console.log(data)

        // pass
        if (data.user_count >= onlineThreshold) {
          //yeni console.log(data);
          //console.log(onlineThreshold + ":" + data.user_count);
          streamers.push(data.owner.display_id);
        }

        //streamers.push(data.owner.display_id)
      })
      resolve('keep')
      return
    }
    // url
    const response = await axios.get('https://webcast.tiktok.com/webcast/feed/', {
      params: {
        'aid': '1988',
        'app_language': 'tr',
        'app_name': 'tiktok_web',
        'browser_language': 'tr-TR',
        'browser_name': 'Mozilla',
        'browser_online': 'true',
        'browser_platform': 'MacIntel',
        'browser_version': userAgent.slice(8),
        'channel': 'tiktok_web',
        'channel_id': '86',
        'content_type': '0',
        'cookie_enabled': 'true',
        'count': '12',
        'device_id': '7384723847387473847',
        'device_platform': 'web_pc',
        'device_type': 'web_h265',
        // 'draw_room_id': '7295007623331597062',
        // 'draw_room_owner_id': '6558370695087947781',
        'focus_state': 'true',
        'from_page': 'user',
        'hidden_banner': 'true',
        'history_len': '1',
        'is_fullscreen': 'false',
        'is_non_personalized': '0',
        'is_page_visible': 'true',
        'max_time': Date.now(),
        'os': 'mac',
        'priority_region': 'TR',
        'referer': 'https://www.tiktok.com/search/live?t=' + Date.now(),
        't': Date.now(),
        'region': 'TR',
        'req_from': 'pc_web_recommend_room_loadmore', //'pc_web_inner_recommend_room',
        'root_referer': 'https://www.tiktok.com/search/live?t=' + Date.now(),
        't': Date.now(),
        'screen_height': '1920',
        'screen_width': '1080',
        'tz_name': 'Europe/Istanbul',
        'webcast_language': 'tr',
        'verifyFp': 'verify_loa4mlwm_3y85QkrP_mifd_410q_9eFc_awZzI4d2bZCn',
        'msToken': 'TFzd8wlQkeaZwMj72EeuVkR-OqPWINeMIMEnQRsqdn45lVpc9iDr9tk8dJGDbkLsBFzRs6y1dtJomUlDZAcr9FExWWD_6aSeDRlSA-n5oYu8_B4Uhq98-3oBZ23HtanVoSI3R9fmueZKgGUGGw==',
        'X-Bogus': 'DFSzswVEpdGANJJvtYONL09WcBjn',
        '_signature': '_02B4Z6wo000014sRgHQAAIDDixGAduDb3q-LEYTAAIgC9c'
      },
      headers: {
        'authority': 'webcast.tiktok.com',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': cookie2,
        'origin': 'https://www.tiktok.com',
        'referer': 'https://www.tiktok.com/',
        'sec-ch-ua': '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': userAgent
      }
    });
    // finished
    if ('undefined' == typeof response.data.data) {
      resolve(checkTotal(streamers, streamerLimit))
      return
    }
    fsx.writeFileSync('log.txt', '-------------------------------\n', (err) => {
      if (err) {

      }
    });
    response.data.data.forEach(val => {
      var data = val.data
      //console.log(data.owner.display_id)
      fsx.writeFileSync('log.txt', data.owner.display_id + '\n', (err) => {
        if (err) {

        }
      });
      // pass
      if (onlineThreshold <= data.user_count) {
        //streamers.push(data.owner.display_id)
      }


    })
    fsx.writeFileSync('log.txt', '-------------------------------\n', (err) => {
      if (err) {

      }
    });

    resolve('keep')
  })
}
async function asyncRunner(count, func, ...func_params) {
  return new Promise(resolve => {
    async function recursiver(count) {
      var runx = await func(count, ...func_params)
      if (runx != 'keep') {
        resolve(runx)
        return
      }
      recursiver(count + 1);
    }
    recursiver(count)
  })
}

app.get('/', async function (req, res) {
  console.log("sa")
  res.send('ping')
})
app.get('/saveStreamers', async function (req, res) {

  const streamers = req.query.streamers;
  if (!streamers) {
    return res.status(400).send('Hata: Kullanıcı adı boş olamaz.');
  } else {
    var licenseCheckRun = licenseCheck(req.query.token);
    if ('license_active' != licenseCheckRun) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        status: 'err',
        msg: licenseCheckRun
      }))
      return
    }

    const jsonToArray = JSON.parse(streamers);
    function onlyUnique(value, index, array) {
      return array.indexOf(value) === index;
    }
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();

    let istanbulSaati = date + "." + month + "." + year + ". " + hours + ":" + minutes + "_" + Math.floor(Math.random() * 1000) + 1;
    const pathy = 'mevcut/';
    istanbulSaati = pathy + 'Mevcut_Yayincilar_'.concat(istanbulSaati);
    istanbulSaati = istanbulSaati += '.txt';
    var jsonToArrayy = jsonToArray.filter(onlyUnique);
    jsonToArrayy.forEach(username => {
      fs.appendFileSync(istanbulSaati, username + '\n', 'utf-8');
    });
    res.send("ok");
  }

})
app.get('/addBlack', async function (req, res) {

  const streamers = req.query.streamers;
  if (!streamers) {
    return res.status(400).send('Hata: Kullanıcı adı boş olamaz.');
  } else {
    var licenseCheckRun = licenseCheck(req.query.token);
    if ('license_active' != licenseCheckRun) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({
        status: 'err',
        msg: licenseCheckRun
      }))
      return
    }

    const jsonToArray = JSON.parse(streamers);
    function onlyUnique(value, index, array) {
      return array.indexOf(value) === index;
    }

    var jsonToArrayy = jsonToArray.filter(onlyUnique);
    jsonToArrayy.forEach(username => {
      fs.appendFileSync('blacked.txt', username + '\n', 'utf-8');
    });
    res.send("ok");
  }

})
app.get('/licenseActivate', async function (req, res) {
  var data = req.query
  if (!data.licenseKey) {
    res.send('error')
    return
  }
  var licenseKey = data.licenseKey

  var licenses = JSON.parse(fs.readFileSync('licenses.json'))
  var licenseKeys = Object.keys(licenses)
  if (-1 == licenseKeys.indexOf(licenseKey)) {
    res.send('not_exist')
    return
  }

  if (!licenses[licenseKeys].status) {
    licenses[licenseKeys].status = true
    fs.writeFileSync('licenses.json', JSON.stringify(licenses, null, 2), 'utf8')
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(licenses))
})
app.get('/licenseCheck', async function (req, res) {
  var data = req.query
  if (!data.licenseKey) {
    res.send('error')
    return
  }

  res.send(licenseCheck(data.licenseKey))
})

app.get('/fetchStreamers', async function (req, res) {
  var data = req.query
  if (!data.searchParam || !data.onlineThreshold || !data.streamerLimit || !data.token) {
    res.send('error')
    return
  }
  var licenseCheckRun = licenseCheck(data.token)
  if ('license_active' != licenseCheckRun) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      status: 'err',
      msg: licenseCheckRun
    }))
    return
  }

  var searchType = 'keyword';
  var searchParam = data.searchParam;
  if (data.searchParam.startsWith('http://') || data.searchParam.startsWith('https://')) {
    searchType = 'url';
  }
  var onlineThreshold = data.onlineThreshold
  var streamerLimit = data.streamerLimit

  //console.log(searchParam) url

  var runFetch = await asyncRunner(1, fetchStreamers, searchType, searchParam, onlineThreshold, streamerLimit)
  fs.readFile('blacked.txt', 'utf8', (err, data) => {
    if (err) {
      console.error('Dosya okuma hatası:', err);
    }
    const satirlar = data.split('\n');
    const temizlenmisSatirlar = satirlar.filter((satir) => satir.trim() !== '');
    runFetchx = runFetch.filter((streamer) => !temizlenmisSatirlar.includes(streamer));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(runFetchx))
  });
})
const server = http.createServer(options, app);
server.listen(3000, () => console.log('3000 up!'))

