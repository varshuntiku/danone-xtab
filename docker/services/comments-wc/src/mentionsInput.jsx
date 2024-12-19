import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const MentionsInput = ({ users, onMentionChange, value, styles = {}, placeholder = 'Add a comment' }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsPosition, setSuggestionsPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [inputValue]);

  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 60%)`;
  };

  const calculatePosition = () => {
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
  
      const textareaRect = textarea.getBoundingClientRect();
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      const atIndex = textBeforeCursor.lastIndexOf('@');
      if (atIndex === -1) return;
  
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      context.font = getComputedStyle(textarea).font;
      const textWidth = context.measureText(textBeforeCursor).width;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10) || 20;
  
      // Calculate the initial top and left positions
      let top = textareaRect.top + textarea.scrollTop + lineHeight;
      let left = textareaRect.left + textarea.scrollLeft + textWidth;
  
      const menuHeight = 200;  // Adjust based on actual dropdown height
      const menuWidth = 200;   // Adjust based on actual dropdown width
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
  
      // Ensure left does not overflow the viewport's width
      if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 10;  // Adding margin on the right
      }
  
      // Ensure top does not overflow the viewport's height
      if (top + menuHeight > viewportHeight) {
        top = viewportHeight - menuHeight - 10;  // Adjusting to fit within the screen
      }
  
      // Avoid moving the dropdown too close to the top of the screen (for comfort)
      if (top < 0) {
        top = 10;  // Minimum distance from the top edge
      }
  
      // For debugging: log calculated positions
  
      // Set the position for the dropdown (suggestions box)
      setSuggestionsPosition({ top, left });
    });
  };
  
  
  
  

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const handleInput = (e) => {
    const value = e.target.value;
    setInputValue(value);

    const atIndex = value.lastIndexOf('@');
    const query = atIndex !== -1 ? value.substring(atIndex + 1).trim() : '';

    if (atIndex !== -1) {
      if (query) {
        showSuggestions(query);
      } else {
        setSuggestions(users.slice(0, 3));
      }
    } else {
      setSuggestions([]);
    }

    onMentionChange({
      newValue: value,
      mentions: users.filter(user => value.includes(user.displayName))
    });
  };

  const handleSuggestionClick = (user) => {
    const atIndex = inputValue.lastIndexOf('@');
    const beforeAt = inputValue.substring(0, atIndex);
    const newValue = `${beforeAt}${user.displayName}`;

    setInputValue(newValue);
    setSuggestions([]);

    onMentionChange({
      newValue,
      mentions: [{ id: user.mail, displayName: user.displayName }]
    });
  };

  const showSuggestions = (query) => {
    const filteredUsers = users
      .filter(user => user.displayName.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3);
    setSuggestions(filteredUsers);
  };

  const renderSuggestions = () => (
    <div
      style={{
        position: 'fixed',
        top: `${suggestionsPosition.top}px`,
        left: `${suggestionsPosition.left}px`,
        width: '150px',
        background: '#fff',
        color: '#220047',
        maxHeight: '200px',
        overflowY: 'auto',
        zIndex: 1000,
        border: '1px solid #ccc',
        borderTop: 'none',
        borderBottomLeftRadius: '4px',
        borderBottomRightRadius: '4px',
        padding: '3px',
        fontSize: '1.3em',
        ...styles,
      }}
    >
      {suggestions.map(user => (
        <div
          key={user.mail}
          style={{
            padding: '3px',
            cursor: 'pointer',
            background: 'white',
            fontSize: '0.65em',
            color: '#220047',
            ...styles
          }}
          onMouseDown={() => handleSuggestionClick(user)}
          onMouseOver={(e) => e.currentTarget.style.background = '#c9def4'}
          onMouseOut={(e) => e.currentTarget.style.background = 'white'}
        >
          <span
            style={{
              backgroundColor: stringToColor(user.displayName),
              color: 'white',
              borderRadius: '50%',
              display: 'inline-block',
              width: '24px',
              height: '24px',
              textAlign: 'center',
              lineHeight: '24px',
              marginRight: '8px'
            }}
          >
            {user.displayName?.[0]?.toUpperCase()}
          </span>
          {user.displayName}
        </div>
      ))}
    </div>
  );
  

  return (
    <div ref={containerRef}>
      <textarea
        ref={textareaRef}
        value={inputValue}
        placeholder={placeholder}
        onChange={handleInput}
        style={{
          width: '98%',
          padding: '8px',
          borderRadius: '4px',
          outline: 'none',
          border: 'none',
          fontSize: '1em',
          fontFamily: 'Graphik, Graphik Compact, Arial, sans-serif',
         
          resize: 'none',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          ...styles
        }}
      />
      {suggestions.length > 0 && ReactDOM.createPortal(
        renderSuggestions(),
        containerRef.current 
      )}
    </div>
  );
};

export default MentionsInput;
