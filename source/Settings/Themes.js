class Themes {

  getTheme(themeColor){
    if(themeColor == "Yellow"){
      return "rgba(228,186,51,1)"
    }
    if(themeColor == "Blue"){
      return "rgba(77,120,204,1)"
    }
    if(themeColor == "Original"){
      return "rgba(242,119,97,1)"
    }
    if(themeColor == "Green"){
      return "rgba(115,201,144,1)"
    }
  }

  getThemeForImages(themeColor){
    if(themeColor == "Yellow"){
      return "yellow"
    }
    if(themeColor == "Blue"){
      return "blue"
    }
    if(themeColor == "Original"){
      return "red"
    }
    if(themeColor == "Green"){
      return "green"
    }
  }

}

const themes = new Themes();
export default themes;
