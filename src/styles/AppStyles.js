import {StyleSheet} from 'react-native';

const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 50,
    backgroundColor: '#f5e8e1', // Updated to light grayish background color
  },
  title: {
    fontSize: 24,
    marginBottom: 30, // Increased bottom margin for more spacing
    color: '#212121', // Dark text color for the title
  },
  button: {
    width: 250, // Fixed width for buttons
    paddingVertical: 10, // Padding top and bottom
    paddingHorizontal: 20, // Padding left and right
    marginVertical: 10, // Margin top and bottom
    alignItems: 'center',
    justifyContent: 'center', // Center text horizontally
    borderRadius: 25, // Rounded corners
    backgroundColor: 'transparent', // Transparent background
    borderWidth: 1, // Border width
    borderColor: '#6200EE', // Purple border color
  },
  continueButton: {
    paddingVertical: 12,
    marginBottom: 20,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
  },
  buttonText: {
    fontSize: 18,
    color: '#6200EE', // Purple text color
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)', // semi-transparent
    zIndex: 1, // place it on top of everything
  },
});

export default AppStyles;
