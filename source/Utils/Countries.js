import {
  Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  TextInput,
  Alert,
  StatusBar,
  Easing,
  Button,
  Animated,
  Platform,
} from 'react-native';
import React, {Component} from 'react';
class Countries {
  // COUNTRY LIST
  get countries() {
    var countries = [
      'Afghanistan',
      'Albania',
      'Algeria',
      'Andorra',
      'Angola',
      'Antigua and Deps',
      'Argentina',
      'Armenia',
      'Australia',
      'Austria',
      'Azerbaijan',
      'Bahamas',
      'Bahrain',
      'Bangladesh',
      'Barbados',
      'Belarus',
      'Belgium',
      'Belize',
      'Benin',
      'Bhutan',
      'Bolivia',
      'Bosnia Herzegovina',
      'Botswana',
      'Brazil',
      'Brunei',
      'Bulgaria',
      'Burkina',
      'Burundi',
      'Cambodia',
      'Cameroon',
      'Canada',
      'Cape Verde',
      'Central African Rep',
      'Chad',
      'Chile',
      'China',
      'Colombia',
      'Comoros',
      'Congo',
      'Congo Democratic Rep',
      'Costa Rica',
      'Croatia',
      'Cuba',
      'Cyprus',
      'Czech Republic',
      'Denmark',
      'Djibouti',
      'Dominica',
      'Dominican Republic',
      'East Timor',
      'Ecuador',
      'Egypt',
      'El Salvador',
      'Equatorial Guinea',
      'Eritrea',
      'Estonia',
      'Ethiopia',
      'Fiji',
      'Finland',
      'France',
      'Gabon',
      'Gambia',
      'Georgia',
      'Germany',
      'Ghana',
      'Greece',
      'Grenada',
      'Guatemala',
      'Guinea',
      'Guinea-Bissau',
      'Guyana',
      'Haiti',
      'Honduras',
      'Hungary',
      'Iceland',
      'India',
      'Indonesia',
      'Iran',
      'Iraq',
      'Ireland {Republic}',
      'Israel',
      'Italy',
      'Ivory Coast',
      'Jamaica',
      'Japan',
      'Jordan',
      'Kazakhstan',
      'Kenya',
      'Kiribati',
      'Korea North',
      'Korea South',
      'Kosovo',
      'Kuwait',
      'Kyrgyzstan',
      'Laos',
      'Latvia',
      'Lebanon',
      'Lesotho',
      'Liberia',
      'Libya',
      'Liechtenstein',
      'Lithuania',
      'Luxembourg',
      'Macedonia',
      'Madagascar',
      'Malawi',
      'Malaysia',
      'Maldives',
      'Mali',
      'Malta',
      'Marshall Islands',
      'Mauritania',
      'Mauritius',
      'Mexico',
      'Micronesia',
      'Moldova',
      'Monaco',
      'Mongolia',
      'Montenegro',
      'Morocco',
      'Mozambique',
      'Myanmar, {Burma}',
      'Namibia',
      'Nauru',
      'Nepal',
      'Netherlands',
      'New Zealand',
      'Nicaragua',
      'Niger',
      'Nigeria',
      'Norway',
      'Oman',
      'Pakistan',
      'Palau',
      'Panama',
      'Papua New Guinea',
      'Paraguay',
      'Peru',
      'Philippines',
      'Poland',
      'Portugal',
      'Qatar',
      'Romania',
      'Russian Federation',
      'Rwanda',
      'St Kitts & Nevis',
      'St Lucia',
      'Saint Vincent & the Grenadines',
      'Samoa',
      'San Marino',
      'Sao Tome & Principe',
      'Saudi Arabia',
      'Senegal',
      'Serbia',
      'Seychelles',
      'Sierra Leone',
      'Singapore',
      'Slovakia',
      'Slovenia',
      'Solomon Islands',
      'Somalia',
      'South Africa',
      'South Sudan',
      'Spain',
      'Sri Lanka',
      'Sudan',
      'Suriname',
      'Swaziland',
      'Sweden',
      'Switzerland',
      'Syria',
      'Taiwan',
      'Tajikistan',
      'Tanzania',
      'Thailand',
      'Togo',
      'Tonga',
      'Trinidad & Tobago',
      'Tunisia',
      'Turkey',
      'Turkmenistan',
      'Tuvalu',
      'Uganda',
      'Ukraine',
      'United Arab Emirates',
      'United Kingdom',
      'United States',
      'Uruguay',
      'Uzbekistan',
      'Vanuatu',
      'Vatican City',
      'Venezuela',
      'Vietnam',
      'Yemen',
      'Zambia',
      'Zimbabwe',
    ];
    return countries;
  }
  // PICKER LIST FOR COUNTRIES GENDER PAGE
  get genderItems() {
    var items = [];
    var countries = this.countries;
    for (i = 0; i < 196; i++) {
      items[i] = {
        label: this.countries[i],
        color: global.isDarkMode ? global.darkModeColors[3] : 'rgba(0,0,0,1)',
        value: this.countries[i],
      };
    }
    return items;
  }
  get newGenderItems() {
    var items = [];
    var countries = this.countries;
    for (i = 0; i < 196; i++) {
      items[i] = {label: this.countries[i], key: i + 1};
    }
    return items;
  }
  // PICKER LIST FOR COUNTRIES MAIN PAGE
  get mainItems() {
    var items = [];
    var countries = this.countries;
    items[0] = {label: 'All Countries', color: 'red', value: 'All Countries'};
    for (i = 1; i < 196; i++) {
      items[i] = {
        label: this.countries[i - 1],
        color: 'black',
        value: this.countries[i - 1],
      };
    }
    return items;
  }

  get newMainItems() {
    var items = [];
    var countries = this.countries;
    items[0] = {
      label: 'All Countries',
      key: 1,
      component: (
        <View style={{}}>
          <Text
            style={{
              fontFamily: global.fontFam,
              color: 'red',
              fontSize: 16,
              textAlign: 'center',
            }}>
            All Countries
          </Text>
        </View>
      ),
    };
    for (i = 1; i < 196; i++) {
      items[i] = {label: this.countries[i - 1], key: i + 1};
    }
    return items;
  }
  changeTest(val) {
    this.setState({test: val});
  }
}

const countries = new Countries();
export default countries;
