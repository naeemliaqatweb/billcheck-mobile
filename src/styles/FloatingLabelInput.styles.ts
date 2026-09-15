import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    position: 'relative',
  },
  inputWrapper: {
    height: 58,
    borderRadius: 12,
    borderWidth: 1.8,
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'relative',
  },
  textInput: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    paddingVertical: 0,
    height: '100%',
  },
  labelContainer: {
    position: 'absolute',
    left: 14,
    paddingHorizontal: 6,
    zIndex: 10,
  },
  labelText: {
    fontWeight: '700',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rtlText: {
    textAlign: 'right',
  },
});
