const autosuggestStyle = {
  'react-autosuggest__container': {
    position: 'relative'
  },
  'react-autosuggest__input': {
    width: '240px',
    height: '30px',
    padding: '10px 20px',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: '300',
    fontSize: '16px',
    border: '1px solid #aaa',
    borderRadius: '4px',
  },
  'react-autosuggest__input--focused': {
    outline: 'none',
  },
  'react-autosuggest__input--open': {
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
  },
  'react-autosuggest__suggestions-container': {
    display: 'none',
  },
  'react-autosuggest__suggestions-container--open': {
    display: 'block',
    position: 'absolute',
    top: '51px',
    width: '280px',
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontFamily: 'Helvetica, sans-serif',
    fontWeight: '300',
    fontSize: '16px',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    zIndex: '2',
  },
  'react-autosuggest__suggestions-list': {
    margin: '0',
    padding: '0',
    listStyleType: 'none',
  },
  'react-autosuggest__suggestion': {
    cursor: 'pointer',
    padding: '10px 20px',
  },
  'react-autosuggest__suggestion--highlighted': {
    backgroundColor: '#ddd',
  },
  'react-autosuggest__section-container': {
    borderTop: '1px dashed #ccc',
  },
  'react-autosuggest__section-container--first': {
    borderTop: '0',
  },
  'react-autosuggest__section-title': {
    padding: '10px 0 0 10px',
    fontSize: '12px',
    color: '#777',
  }
};

export default autosuggestStyle;