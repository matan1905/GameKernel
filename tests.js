GK.registerCommand("yo", async function(args){
  GK.print("soy bebo agua?")
  var a = await GK.prompt()
  console.log(a);
  var b = await GK.prompt()
  console.log(b);
  var c = await GK.prompt()
  console.log(c);

})
