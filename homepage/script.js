var quoteElem = document.getElementById("quoteWrapper");
var quoteTopElem = document.getElementById("quoteMark");
var quoteBottomElem = document.getElementById("quoteMarkBottom");

function positionQuotes() {
  var scrollPos = document.body.scrollTop;
  var quotePos = quoteElem.getBoundingClientRect().top;
  var relativePos = scrollPos - quotePos;
  
  quoteTopElem.style.top = 90 + relativePos / 20 + "px";
  quoteBottomElem.style.top = 180 + relativePos / 20 + "px";
}

window.onload = document.onscroll = positionQuotes;

smoothScroll.init({
  easing: 'easeInOutCubic',
  selectorHeader: ".nav",
  updateURL: false
});

document.getElementById("contactButton").onclick = function() {
  var popup = document.getElementById("contactPopup");
  if(popup.className === "") {
    var address = 'z534bm,.xcustommathgames@gmail.com';
    address = address.substr(9);
    popup.innerHTML = "Email us at <a href='mailto:" + address + "' data-clipboard-text='" + address + "'>" + address + "</a>";
    popup.className = "open";
  } else {
    popup.className = "";
  }
};

var clipboard = new Clipboard('#contactPopup a');
clipboard.on('success', function(e) {
  document.getElementById("copyConfirm").className = "showing";
  window.setTimeout(function(){
    document.getElementById("copyConfirm").className = "";
  }, 1800);
});