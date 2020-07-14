class Themes {

  get theme(themeColor){
    if(themeColor == "Yellow"){
      return "rgba(228,186,51,1)"
    }
    if(themeColor == "Blue"){
      return "rgba(77,120,204,1)"
    }
    if(themeColor == "Original"){
      return "rgba(241,51,18,1)"
    }
    if(themeColor == "Original"){
      return "rgba(115,201,144,1)"
    }
  }
  get isDarkmode(){

  }
}

const themes = new Themes();
export default themes;
