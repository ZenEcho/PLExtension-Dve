// $(document).ready(function () {
//   $("[data-i18n]").each(function () {
//     $(this).html(chrome.i18n.getMessage($(this).attr("data-i18n")));
//   });
// })

function i18n() {
  $("[data-i18n]").each(function () {
    let i18nKey = $(this).attr("data-i18n");
    let i18nMessage = "";
    let i18nKeys = i18nKey.split('+').map(key => key.trim());

    i18nKeys.forEach(function (key) {
      i18nMessage += chrome.i18n.getMessage(key);
    });

    $(this).html(i18nMessage);
  });
}

