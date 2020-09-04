class Licences {
  // COUNTRY LIST
  get licences(){
    var licences = [
      "@react-native-community/async-storage",
      "@react-native-community/masked-view",
      "@react-navigation/bottom-tabs",
      "@react-navigation/native",
      "@react-navigation/stack",
      "react-native-firebase",
      "react",
      "react-native",
      "react-native-fs",
      "react-native-gesture-handler",
      "react-native-gifted-chat",
      "react-native-image-crop-picker",
      "react-native-image-viewing",
      "react-native-image-zoom-viewer",
      "react-native-loading-spinner-overlay",
      "react-native-localize",
      "react-native-modal",
      "react-native-onesignal",
      "react-native-picker-select",
      "react-native-safe-area-context",
      "react-native-screens",
      "react-native-status-bar-height",
      "react-native-swipeable",
      "react-native-vector-icons",
      "react-navigation",
      "react-navigation-stack",
      "react-navigation-transitions",
      "rn-fetch-blob"
    ];
    return licences;
  }
  get length(){
    var licences = [
      "@react-native-community/async-storage",
      "@react-native-community/masked-view",
      "@react-navigation/bottom-tabs",
      "@react-navigation/native",
      "@react-navigation/stack",
      "react-native-firebase",
      "react",
      "react-native",
      "react-native-fs",
      "react-native-gesture-handler",
      "react-native-gifted-chat",
      "react-native-image-crop-picker",
      "react-native-image-viewing",
      "react-native-image-zoom-viewer",
      "react-native-loading-spinner-overlay",
      "react-native-localize",
      "react-native-modal",
      "react-native-onesignal",
      "react-native-picker-select",
      "react-native-safe-area-context",
      "react-native-screens",
      "react-native-status-bar-height",
      "react-native-swipeable",
      "react-native-vector-icons",
      "react-navigation",
      "react-navigation-stack",
      "react-navigation-transitions",
      "rn-fetch-blob"
    ];
    return licences.length;
  }
  get licence(){
    var copyright = ""
    var mitlicencedlibraries = {
      "@react-native-community/async-storage": "2015-present, Facebook, Inc.",
      "@react-native-community/masked-view": "2015-present, Facebook, Inc.",
      "@react-navigation/bottom-tabs": "2017 React Navigation Contributors",
      "@react-navigation/native": "2017 React Navigation Contributors",
      "@react-navigation/stack": "2017 React Navigation Contributors",
      "react": "Facebook, Inc. and its affiliates.",
      "react-native": "Facebook, Inc. and its affiliates.",
      "react-native-fs": "2015 Johannes Lumpe",
      "react-native-gesture-handler": "2016 Krzysztof Magiera",
      "react-native-gifted-chat": "2019 Farid from Safi",
      "react-native-image-crop-picker": "2017 Ivan Pusic",
      "react-native-image-viewing": "",
      "react-native-image-zoom-viewer": "2015 ascoders",
      "react-native-localize": "2017-present, Mathieu Acthernoene",
      "react-native-modal": "2017 React Native Community",
      "react-native-picker-select": "LawnStarter",
      "react-native-safe-area-context": "2019 Th3rd Wave",
      "react-native-screens": "2018 Krzysztof Magiera",
      "react-native-status-bar-height": "2017-present Dmitry Patsura <talk@dmtry.me> https://github.com/ovr",
      "react-native-swipeable": "2016 Jeff Hanson",
      "react-native-vector-icons": "2015 Joel Arvidsson",
      "react-navigation": "2017 React Navigation Contributors",
      "react-navigation-stack": "2017 React Navigation Contributors",
      "react-navigation-transitions": "2018 Phil Mok",
      "rn-fetch-blob": "2017 xeiyan@gmail.com"
    }
    var mitlicenced = false
    var oneSignalLicenced = false
    var firebaselicenced = false
    var firebaselicencedlibraries = {
      "react-native-firebase": "2016-present Invertase Limited <oss@invertase.io> & Contributors",
    }
    var oneSignalLicence = {
      "react-native-onesignal": "2019 OneSignal",
    }
    console.log("mitlicenced", mitlicencedlibraries[global.selectedLicence.replace('_','/')])
    console.log("oneSignalLicenced", oneSignalLicence[global.selectedLicence.replace('_','/')])
    console.log("firebaselicenced", firebaselicencedlibraries[global.selectedLicence.replace('_','/')])
    // MIT LICENCE
    if (mitlicencedlibraries[global.selectedLicence.replace('_','/')] != null){
      copyright = mitlicencedlibraries[global.selectedLicence.replace('_','/')]
      mitlicenced = true
    }
    // ONE SIGNAL LICENCE
    else if (oneSignalLicence[global.selectedLicence.replace('_','/')] != null) {
      copyright = oneSignalLicence[global.selectedLicence.replace('_','/')]
      oneSignalLicenced = true
    }
    // firebase LICENCE
    else if (firebaselicencedlibraries[global.selectedLicence.replace('_','/')] != null) {
      copyright = firebaselicencedlibraries[global.selectedLicence.replace('_','/')]
      firebaselicenced = true
    }
    var mitlicenceOneSignal = "MIT License " +
    "\n " +
    "Copyright (c)  " + copyright + " " +
    "\n " +
    "Permission is hereby granted, free of charge, to any person obtaining a copy " +
    "of this software and associated documentation files (the \"Software\"), to deal " +
    "in the Software without restriction, including without limitation the rights " +
    "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell " +
    "copies of the Software, and to permit persons to whom the Software is " +
    "furnished to do so, subject to the following conditions: " +
    "\n " +
    "1. The above copyright notice and this permission notice shall be included in all " +
    "copies or substantial portions of the Software. " +
    "\n " +
    "2. All copies of substantial portions of the Software may only be used in connection" +
    " with services provided by OneSignal." +
    "\n " +
    "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR " +
    "IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, " +
    "FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE " +
    "AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER " +
    "LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, " +
    "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE " +
    "SOFTWARE. \n"

    var mitlicence = "MIT License " +
    "\n " +
    "Copyright (c)  " + copyright + " " +
    "\n " +
    "Permission is hereby granted, free of charge, to any person obtaining a copy " +
    "of this software and associated documentation files (the \"Software\"), to deal " +
    "in the Software without restriction, including without limitation the rights " +
    "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell " +
    "copies of the Software, and to permit persons to whom the Software is " +
    "furnished to do so, subject to the following conditions: " +
    "\n " +
    "The above copyright notice and this permission notice shall be included in all " +
    "copies or substantial portions of the Software. " +
    "\n " +
    "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR " +
    "IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, " +
    "FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE " +
    "AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER " +
    "LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, " +
    "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE " +
    "SOFTWARE. \n"
    var firebaselicence = "Apache License " +
    "\n " +
    "------------------ " +
    "\n " +
    "Copyright (c)  " + copyright + " " +
    "\n " +
    "Licensed under the Apache License, Version 2.0 (the \"License\"); " +
    "you may not use this library except in compliance with the License. " +
    "\n " +
    "You may obtain a copy of the Apache-2.0 License at " +
    "\n " +
    "    http://www.apache.org/licenses/LICENSE-2.0 " +
    "\n " +
    "Unless required by applicable law or agreed to in writing, software " +
    "distributed under the License is distributed on an \"AS IS\" BASIS, " +
    "WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. " +
    "See the License for the specific language governing permissions and " +
    "limitations under the License. " +
    "\n " +
    "Creative Commons Attribution 3.0 License " +
    "\n " +
    "---------------------------------------- " +
    "\n " +
    "Copyright (c)  " + copyright + " " +
    "\n " +
    "Documentation and other instructional materials provided for this project " +
    "(including on a separate documentation repository or it's documentation website) are " +
    "licensed under the Creative Commons Attribution 3.0 License. Code samples/blocks " +
    "contained therein are licensed under the Apache License, Version 2.0 (the \"License\"), as above. " +
    "\n " +
    "You may obtain a copy of the Creative Commons Attribution 3.0 License at " +
    "\n " +
    "    https://creativecommons.org/licenses/by/3.0/ "
    var apachelicence = "Copyright (c)  " + copyright + " " +
    "\n " +
    "Apache License " +
    "\n " +
    "Version 2.0, January 2004 " +
    "\n " +
    "http://www.apache.org/licenses/ " +
    "\n " +
    "TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION " +
    "\n " +
    "1. Definitions. " +
    "\n " +
    "\"License\" shall mean the terms and conditions for use, reproduction, " +
    "and distribution as defined by Sections 1 through 9 of this document. " +
    "\n " +
    "\"Licensor\" shall mean the copyright owner or entity authorized by " +
    "the copyright owner that is granting the License. " +
    "\n " +
    "\"Legal Entity\" shall mean the union of the acting entity and all " +
    "other entities that control, are controlled by, or are under common " +
    "control with that entity. For the purposes of this definition, " +
    "\"control\" means (i) the power, direct or indirect, to cause the " +
    "direction or management of such entity, whether by contract or " +
    "otherwise, or (ii) ownership of fifty percent (50%) or more of the " +
    "outstanding shares, or (iii) beneficial ownership of such entity. " +
    "\n " +
    "\"You\" (or \"Your\") shall mean an individual or Legal Entity " +
    "exercising permissions granted by this License. " +
    "\n " +
    "\"Source\" form shall mean the preferred form for making modifications, " +
    "including but not limited to software source code, documentation " +
    "source, and configuration files. " +
    "\n " +
    "\"Object\" form shall mean any form resulting from mechanical " +
    "transformation or translation of a Source form, including but " +
    "not limited to compiled object code, generated documentation, " +
    "and conversions to other media types. " +
    "\n " +
    "\"Work\" shall mean the work of authorship, whether in Source or " +
    "Object form, made available under the License, as indicated by a " +
    "copyright notice that is included in or attached to the work " +
    "(an example is provided in the Appendix below). " +
    "\n " +
    "\"Derivative Works\" shall mean any work, whether in Source or Object " +
    "form, that is based on (or derived from) the Work and for which the " +
    "editorial revisions, annotations, elaborations, or other modifications " +
    "represent, as a whole, an original work of authorship. For the purposes " +
    "of this License, Derivative Works shall not include works that remain " +
    "separable from, or merely link (or bind by name) to the interfaces of, " +
    "the Work and Derivative Works thereof. " +
    "\n " +
    "\"Contribution\" shall mean any work of authorship, including " +
    "the original version of the Work and any modifications or additions " +
    "to that Work or Derivative Works thereof, that is intentionally " +
    "submitted to Licensor for inclusion in the Work by the copyright owner " +
    "or by an individual or Legal Entity authorized to submit on behalf of " +
    "the copyright owner. For the purposes of this definition, \"submitted\" " +
    "means any form of electronic, verbal, or written communication sent " +
    "to the Licensor or its representatives, including but not limited to " +
    "communication on electronic mailing lists, source code control systems, " +
    "and issue tracking systems that are managed by, or on behalf of, the " +
    "Licensor for the purpose of discussing and improving the Work, but " +
    "excluding communication that is conspicuously marked or otherwise " +
    "designated in writing by the copyright owner as \"Not a Contribution.\" " +
    "\n " +
    "\"Contributor\" shall mean Licensor and any individual or Legal Entity " +
    "on behalf of whom a Contribution has been received by Licensor and " +
    "subsequently incorporated within the Work. " +
    "\n " +
    "2. Grant of Copyright License. Subject to the terms and conditions of " +
    "this License, each Contributor hereby grants to You a perpetual, " +
    "worldwide, non-exclusive, no-charge, royalty-free, irrevocable " +
    "copyright license to reproduce, prepare Derivative Works of, " +
    "publicly display, publicly perform, sublicense, and distribute the " +
    "Work and such Derivative Works in Source or Object form. " +
    "\n " +
    "3. Grant of Patent License. Subject to the terms and conditions of " +
    "this License, each Contributor hereby grants to You a perpetual, " +
    "worldwide, non-exclusive, no-charge, royalty-free, irrevocable " +
    "(except as stated in this section) patent license to make, have made, " +
    "use, offer to sell, sell, import, and otherwise transfer the Work, " +
    "where such license applies only to those patent claims licensable " +
    "by such Contributor that are necessarily infringed by their " +
    "Contribution(s) alone or by combination of their Contribution(s) " +
    "with the Work to which such Contribution(s) was submitted. If You " +
    "institute patent litigation against any entity (including a " +
    "cross-claim or counterclaim in a lawsuit) alleging that the Work " +
    "or a Contribution incorporated within the Work constitutes direct " +
    "or contributory patent infringement, then any patent licenses " +
    "granted to You under this License for that Work shall terminate " +
    "as of the date such litigation is filed. " +
    "\n " +
    "4. Redistribution. You may reproduce and distribute copies of the " +
    "Work or Derivative Works thereof in any medium, with or without " +
    "modifications, and in Source or Object form, provided that You " +
    "meet the following conditions: " +
    "\n " +
    "(a) You must give any other recipients of the Work or " +
    "Derivative Works a copy of this License; and " +
    "\n " +
    "(b) You must cause any modified files to carry prominent notices " +
    "stating that You changed the files; and " +
    "\n " +
    "(c) You must retain, in the Source form of any Derivative Works " +
    "that You distribute, all copyright, patent, trademark, and " +
    "attribution notices from the Source form of the Work, " +
    "excluding those notices that do not pertain to any part of " +
    "the Derivative Works; and " +
    "\n " +
    "(d) If the Work includes a \"NOTICE\" text file as part of its " +
    "distribution, then any Derivative Works that You distribute must " +
    "include a readable copy of the attribution notices contained " +
    "within such NOTICE file, excluding those notices that do not " +
    "pertain to any part of the Derivative Works, in at least one " +
    "of the following places: within a NOTICE text file distributed " +
    "as part of the Derivative Works; within the Source form or " +
    "documentation, if provided along with the Derivative Works; or, " +
    "within a display generated by the Derivative Works, if and " +
    "wherever such third-party notices normally appear. The contents " +
    "of the NOTICE file are for informational purposes only and " +
    "do not modify the License. You may add Your own attribution " +
    "notices within Derivative Works that You distribute, alongside " +
    "or as an addendum to the NOTICE text from the Work, provided " +
    "that such additional attribution notices cannot be construed " +
    "as modifying the License. " +
    "\n " +
    "You may add Your own copyright statement to Your modifications and " +
    "may provide additional or different license terms and conditions " +
    "for use, reproduction, or distribution of Your modifications, or " +
    "for any such Derivative Works as a whole, provided Your use, " +
    "reproduction, and distribution of the Work otherwise complies with " +
    "the conditions stated in this License. " +
    "\n " +
    "5. Submission of Contributions. Unless You explicitly state otherwise, " +
    "any Contribution intentionally submitted for inclusion in the Work " +
    "by You to the Licensor shall be under the terms and conditions of " +
    "this License, without any additional terms or conditions. " +
    "Notwithstanding the above, nothing herein shall supersede or modify " +
    "the terms of any separate license agreement you may have executed " +
    "with Licensor regarding such Contributions. " +
    "\n " +
    "6. Trademarks. This License does not grant permission to use the trade " +
    "names, trademarks, service marks, or product names of the Licensor, " +
    "except as required for reasonable and customary use in describing the " +
    "origin of the Work and reproducing the content of the NOTICE file. " +
    "\n " +
    "7. Disclaimer of Warranty. Unless required by applicable law or " +
    "agreed to in writing, Licensor provides the Work (and each " +
    "Contributor provides its Contributions) on an \"AS IS\" BASIS, " +
    "WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or " +
    "implied, including, without limitation, any warranties or conditions " +
    "of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A " +
    "PARTICULAR PURPOSE. You are solely responsible for determining the " +
    "appropriateness of using or redistributing the Work and assume any " +
    "risks associated with Your exercise of permissions under this License. " +
    "\n " +
    "8. Limitation of Liability. In no event and under no legal theory, " +
    "whether in tort (including negligence), contract, or otherwise, " +
    "unless required by applicable law (such as deliberate and grossly " +
    "negligent acts) or agreed to in writing, shall any Contributor be " +
    "liable to You for damages, including any direct, indirect, special, " +
    "incidental, or consequential damages of any character arising as a " +
    "result of this License or out of the use or inability to use the " +
    "Work (including but not limited to damages for loss of goodwill, " +
    "work stoppage, computer failure or malfunction, or any and all " +
    "other commercial damages or losses), even if such Contributor " +
    "has been advised of the possibility of such damages. " +
    "\n " +
    "9. Accepting Warranty or Additional Liability. While redistributing " +
    "the Work or Derivative Works thereof, You may choose to offer, " +
    "and charge a fee for, acceptance of support, warranty, indemnity, " +
    "or other liability obligations and/or rights consistent with this " +
    "License. However, in accepting such obligations, You may act only " +
    "on Your own behalf and on Your sole responsibility, not on behalf " +
    "of any other Contributor, and only if You agree to indemnify, " +
    "defend, and hold each Contributor harmless for any liability " +
    "incurred by, or claims asserted against, such Contributor by reason " +
    "of your accepting any such warranty or additional liability. " +
    "\n " +
    "END OF TERMS AND CONDITIONS " +
    "\n " +
    "APPENDIX: How to apply the Apache License to your work. " +
    "\n " +
    "To apply the Apache License to your work, attach the following " +
    "boilerplate notice, with the fields enclosed by brackets \"[]\" " +
    "replaced with your own identifying information. (Don't include " +
    "the brackets!)  The text should be enclosed in the appropriate " +
    "comment syntax for the file format. We also recommend that a " +
    "file or class name and description of purpose be included on the " +
    "same \"printed page\" as the copyright notice for easier " +
    "identification within third-party archives. " +
    "\n " +
    "Copyright [yyyy] [name of copyright owner] " +
    "\n " +
    "Licensed under the Apache License, Version 2.0 (the \"License\"); " +
    "you may not use this file except in compliance with the License. " +
    "You may obtain a copy of the License at " +
    "\n " +
    " http://www.apache.org/licenses/LICENSE-2.0 " +
    "\n " +
    "Unless required by applicable law or agreed to in writing, software " +
    "distributed under the License is distributed on an \"AS IS\" BASIS, " +
    "WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. " +
    "See the License for the specific language governing permissions and " +
    "limitations under the License."
    if(mitlicenced){
      return mitlicence
    }
    else if (oneSignalLicenced) {
      return mitlicenceOneSignal
    }
    else if (firebaselicenced) {
      return firebaselicence
    }
  }
}

const licences = new Licences();
export default licences;
