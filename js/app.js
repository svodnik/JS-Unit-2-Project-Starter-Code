/*
  GA SF JSD6
  Jules Forrest
  Please add all Javascript code to this file.
*/

$('.article').click(function(){
  $('#popUp').removeClass('hidden loader');
  var headline = $(this).find('h3').text();
  $('#popUp').find('h1').text(headline);

})

$('.closePopUp').click(function(){
  $('#popUp').addClass('hidden');
});
