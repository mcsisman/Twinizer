import { Composer, InputToolbar, Send } from "react-native-gifted-chat";

const CustomInputToolbar = (props) => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: colors.grey200,
        alignContent: "center",
        justifyContent: "center",
        borderWidth: 0,
        paddingTop: 6,
        marginHorizontal: 6,
        borderRadius: 32,
        borderTopColor: "transparent",
      }}
    />
  );
};
