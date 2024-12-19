import React from 'react';
import { createRoot } from 'react-dom/client';
import CommentsDrawer from './CommentsDrawer';
import styles from './CommentsDrawer.module.css';
import addStyles from './CommentAdd.module.css';
import './mentionsInput';
import commentStyles from './Comment.module.css';
import replyStyles from './Reply.module.css';
import replyAddStyles from './ReplyAdd.module.css'
import { GlobalProvider } from '../Context/GlobalContext';
import globalState from '../store/GlobalState';
import { AuthProvider } from '../Context/AuthContext';
import commentListStyles from './commentList.module.css'
import customSnackbarStyles from './CustomSnackbar.module.css';
import noCommentStyles from './noCommentStyles.module.css'
class CommentsDrawerElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._props = {};
  }
  set filter_id(value) {
    this._props.filter_id = value;

  }
  get filter_id() {
    return this._props.filter_id;
  }


  connectedCallback() {
    const container = document.createElement('div');
    this.shadowRoot.appendChild(container);
    const style = document.createElement('style');
    style.textContent = `
      .${styles.body} {
       position: fixed;
    right: -60rem;
    bottom: 0;
    z-index: 100000;
    width: 18em;
    height: 95%;
    background: #ffffff;
    border: 1px solid #BF99BD;
    padding: 0.5em;
    padding-top: 0;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
    box-shadow: 0px 4px 8px 0px #220047;
    transition: right 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
    display: flex;
    flex-direction: column;

      }
      .${styles.bodyVisible} {
        right: 0;
      }
      .${styles.commentTitle} {
            display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9em;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
    color: #220047;
    font-weight: 550;
      
      }
      .${styles.titlePane} {
       display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #BF99BD;
    
      }
      .${styles.buttonContainer} {
           display: flex;
    align-items: center;
    gap: 1px;
    margin-left: 1em;
    height: 2.2em;
      }
      .${styles.closeButton} {
            background: none;
    border: none;
    cursor: pointer;
    margin: 0 !important;
    padding: 0.2em;
      }
       .${styles.closeButton} svg {
           width: 1em;
    height: 1em;
      }
      .${styles.filterButton} {
       margin: 0 !important;
    padding: 0.2em;
    position: relative;
    margin-left: 2em;
    cursor: pointer;
      }
  .${styles.notificationPreview} {
  position: absolute;
  right: 0; 
  border: 1px solid #BF99BD; 
  background-color: white;
  max-height: 50vh; 
  max-width: 15em; 
  width: 12em; 
  overflow-y: auto; 
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); 
}
      .${styles.filterButton} svg {
           width: 1em;
    height: 1em;
      }
      .${styles.closeButton}:hover, .${styles.filterButton}:hover {
        background-color: #00000012;
        border-radius: 50%;
      }
   
      .${styles.addCommentContainer} {
         margin-top: 1em;
    font-size: 0.7em;
        margin-bottom: 1em;
    color: #220047;
    letter-spacing: 0.5px;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
      }
 

.${styles.menuContainer} {
  position: relative;
  z-index: 101;
}

.${styles.menuButton} {
  background: none;
  border: none;
  cursor: pointer;
}


.${styles.menu} {
       position: absolute;
    background: white;
    color: rgba(0, 0, 0, 0.87);
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    border: 1px solid #ccc;
    box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
    z-index: 1000;
    width: 6em;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
    overflow-y: hidden;
    height: 8em;
    left: 180px;
    top: -0.7em;
}

.${styles.header} {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #eee;
}
  
.${styles.badge} {
position: absolute;
    background-color: #1976d2;
    color: white;
    border-radius: 50%;
    font-size: 0.5em;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
    top: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    height: 1.3em;
    min-height: 1em;
    width: 1.5em;
}

.${styles.menuTitle} {
  flex: 1;
  font-weight: bold;
}

.${styles.closeButton} {
  background: none;
  border: none;
  cursor: pointer;
}

.${styles.menuItems} {
  max-height: 200px;
  overflow-y: auto;
}

.${styles.menuItem} {
        display: flex;
    align-items: center;
    font-size: 0.61em;
    color: #220047;
    padding: 1rem;
    height: 2em;
    cursor: pointer;
    padding: 3px;
}

.${styles.menuItem}.${styles.checked} {
  background: #e0f7fa;
}

.${styles.checkbox} {
  margin-left: 8px;
  cursor: pointer;

}
.${styles.checkbox}:checked{
  background-color: #220047; 
  color: white; 
}
.${styles.buttonDivider} {
  border-top: 1px solid #BF99BD;
}

.${styles.resetButton} {
      display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 1.8em;
    text-transform: none;
    background: none;
    font-size: 0.61em;
    color: #220047;
    border: none;
    cursor: pointer;
    margin-top: 0.5em;
}
    .${styles.resetButton}:hover{
    color: #220047;
    opacity: 1;
    background-color: #EDE9F0;
    border-radius: 2px;
  }
/* CommentsDrawer.module.css */

.${styles.checkboxWrapper} {
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
}

.${styles.checkbox} {
  width: 10px; /* Adjust size */
    height: 10px;
    margin-right: 8px;
    cursor: pointer;
    border: 2px solid #ccc; /* Border color when unchecked */
    border-radius: 3px;
    position: relative;
    display: inline-block;
    vertical-align: middle;
}
.${styles.progress} {
position: absolute;
   top: 50%;
    bottom: 50%;
    left: 40%;
}
    .${styles.Menuprogress}{
           width: 18px;
    height: 18px;
    display: flex;
    margin-left: -2em;
    justify-content: center;
    align-items: center;
  }

.${styles.checkbox} + label {
  display: flex;
  align-items: center;
  cursor: pointer;
}
  .${styles.login}  {
       padding-right: 0.6em;
    color: #220047;
    border: 1px solid #220047;
    box-shadow: none;
    background-color: transparent;
    border-radius: 0.2em;
    cursor: pointer;
    padding-left: 0.6em;
    padding-top: 0.2em;
    padding-bottom: 0.2em;
}
.${styles.login}:hover {
       border: 1px solid #220047;
    border-radius: 0.2em;
    color: #FFA497;
    opacity: 0.8;
    box-shadow: 0.1rem 0.1rem 0.4rem 0rem #220047;
    background-color: #220047;
  cursor: pointer;
}


.${styles.checkbox}:checked ::after  {
content: '';
    position: absolute;
    top: 2px;
    left: 4px;
    width: 5px;
    height: 10px;
    border: solid white; /* White tick */
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

    /* CommentAdd.module.css styles */
      .${addStyles.commentBox} {
       margin-top: 1.2em;
    width: 100%;
    padding: 0.3em;
    color: #989C9C;
    box-sizing: border-box;
    transition: border 0.3s, height 0.3s;
    height: 2.2em;
        border-radius: 3px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1.5px solid #A8AFB8;
    position: relative;
      }
      .${addStyles.commentBoxFocused} {
                border: 1.5px solid #2B70C2;
    height: auto;
    min-height: 8em;
    border-radius: 3px;
      }
      .${addStyles.textFieldWrapper} {
               flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: -0.5em;
  
      }

  .${addStyles.mentionInput} {
    min-height: 4em;
    width: 100%;
    border: none;
    outline: none;
    resize: none;
    font-size: 0.9em;
    line-height: 2em;
    position: relative;
    overflow-y: visible;
    border: none;
    outline: none;
      }
  
  .${addStyles.mentionInput} textarea {
        border: none;
        color: #000000; /* Use actual theme color */
        outline: none;
        font-size: 1.6rem;
        line-height: 2rem;
        letter-spacing: 0.5px;
   }
 .${addStyles.mentionInput} textarea:focus {
        border: none;
        outline: none;
  }
  .${addStyles.mentionInput} mention{
        display: inline-flex;
        align-items: center;
        font-weight: 400 !important;
        color: #BF99BD; /* Replace with actual color */
        font-size: 1.6rem !important;
        position: relative;
        z-index: 2000 !important;
        height: 2.2rem !important;
        background-color: #ffffff; /* Replace with actual color */
   }
  .${addStyles.mention} textarea {
        color: transparent !important;
  }

   
      .${addStyles.divider} {
  
        display: none;
        border-bottom: 1px solid #BF99BD;
       
      }
      .${addStyles.dividerFocused}{
         display: block;
    border-bottom: 1px solid #BF99BD;
    margin-top: 0.3em;
    margin-bottom: 0.5em;
      }
      .${addStyles.actionButtons} {
          
        display: none;
    justify-content: space-between;
    align-items: center;
    height: 2em;
      }
      .${addStyles.actionButtonsVisible} {
        display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2em;
      }
      .${addStyles.iconButton} {
        padding: 0.8rem;
        margin-top: 0.2rem;
        
      }
      .${addStyles.rotatedAttachIcon} {
        cursor:pointer;
        padding:0.8rem;
        color: #220047;
        marfin-left:1rem;
      }
    .${addStyles.rotatedAttachIcon} :hover{
      cursor: pointer;
      background-color: #00000012;
      border-radius: 50%;
     
    }
   
      .${addStyles.sendButton} {
        cursor:pointer;
        padding: 0.5rem;
      }
     .${addStyles.sendButton} :hover {
      cursor: pointer;
      background-color: #00000012;
      border-radius: 50%;
      display: inline-flex;
    
  }
      .${addStyles.attachmentContainer} {
          display: flex;
    flex-direction: column;


      }
      .${addStyles.attachmentCard} {
      display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 1em;
    border: none;
    background-color: #F9F8F8;
    border-radius: 2px;
    padding: 0.3rem;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
    position: relative;
    color: #220047;
      }
 .${addStyles.attachmentCardComponent} {
    color: #220047;
    width: 100%;
    gap: 1em;
    height: 0.4em;
    display: flex;
    padding: 0.8em;
    font-size: 0.7em;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
    margin-top: 0.8em;
    margin-left: 2.5em;
    align-items: center;
    border-radius: 2px;
    padding-left: rem;
    justify-content: start;
    background-color: #F9F8F8;
  }

      .${addStyles.fileIcon} {
           width: 1em;
    height: 1em;
      }
      .${addStyles.fileName} {
          flex-grow: 1;
    margin-left: 1em;
    margin-right: 1em;
    white-space: nowrap;
    overflow: hidden;
    font-size: 0.9em;
    text-overflow: ellipsis;
    max-width: 50%;
      }

   .${addStyles.fileNameComponent}{
      flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    font-size: 0.75em;
    text-overflow: ellipsis;
    max-width: 45%;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
}
      .${addStyles.fileSize} {
      font-size: 0.8em;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
      }

      .${addStyles.cancelIcon} {
        width: 1em;
    height: 1em;
    margin-left: em;
    margin-right: 1.5em;
    cursor: pointer;
      }
      .${addStyles.downloadIcon} {
           width: 1em;
    height: 1em;
        margin-right: 1em;

    cursor: pointer;
      }
         .${addStyles.loadingBarContainer} {
      position: relative;
    width: 100%;
    height: 2.7px;
    border-radius: 2px;
    overflow: hidden;
    margin-top: 2em;
    /* margin-bottom: -5rem; */
    margin-left: -35em;
}
      
      .${addStyles.loadingBar} {
       height: 100%;
    background-color: #220047;
    border-radius: 2px;
      }
      .${addStyles.warningText} {
       margin-top: 0.5rem;
    font-size: 0.81em;
    padding-left: 0.3em;
    color: gray;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;

      }

  .${addStyles.uploadProgress} {
                margin-right: auto;
    margin-left: -10em;
      }
.${commentStyles.commentContainer} {
         color: #220047;
    padding-top: 0.1em;
    border-bottom: 1px solid #BF99BD;
    margin-bottom: 0.1em;
    width: 100%;
    padding-bottom: 0.3em;
}


.${commentStyles.progress} {
   
      top:50%;
    left:50%;
    position:absolute;
    transform:translate(-50%,-50%);
}

/* Header styles */
.${commentStyles.header} {
    display: flex;
    align-items: center;
}

.${commentStyles.content} {
   font-size: 0.64em;
    padding-left: 3.3em;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
}
.${commentStyles.textField} {
    width: 100%;
    
}

/* Avatar styles */
.${commentStyles.avatar} {
        width: 30px;
    height: 30px;
   
    background-color: #220047;
    color: white;
    font-family: inherit;
    border-radius: 50%;
    font-size: 0.7em;
    display: flex;
    align-items: center;
    justify-content: center
}

/* Avatar wrapper styles */
.${commentStyles.avatarWrapper} {
         width: 2em;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
}

/* Name styles */
.${commentStyles.name} {
        font-weight: 550;
    font-size: 10px;
    line-height: 1.5rem;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
}


/* Edit icon styles */
.${commentStyles.editIcon} {
    visibility: hidden;
    padding: 0.5rem;
}

/* Comment hover styles */
.${commentStyles.commentHovered}:hover .${commentStyles.editIcon} {
    visibility: visible;
    padding: 0.5rem;
}

/* Divider styles */
.${commentStyles.divider} {
    border-top: 1px solid #dcdcdc;
    margin: 8px 0;
}


.${commentStyles.iconButton} :hover {
    background-color: #00000012;
    border-radius: 50%;
    cursor: pointer;
}

.${commentStyles.disabled }{
    pointer-events: none; 
   
   
}

.${commentStyles.iconButton} svg {
    fill: inherit; 
}


.${commentStyles.bookmarkIcon} {
    display: flex;
    padding: 0.5rem;
    position: relative;
    align-items: center;
    justify-content: center;
}


.${commentStyles.resolvedIcon}{
 background-color: #00000012;
    border-radius: 50%;
    cursor:pointer;
}

.${commentStyles.bookMark}, .${commentStyles.bookMarkFilled} {
    width: 2rem;
    height: 2rem;
    stroke: #333;
}

/* Filled bookmark styles */
.${commentStyles.bookMarkFilled} {
    fill: #333;
}

/* Menu icon styles */
.${commentStyles.menuIcon} {
    padding: 0.5rem;
}

/* Bookmark and resolve container styles */


/* Icon bar styles */
.${commentStyles.iconBar} {
           display: flex;
    align-items: center;
    margin-left: 14em;
    margin-top: 0.7em;
    margin-bottom: 0.8em;
    justify-content: space-between;
    gap: 8px;
   
}


/* Attachment container styles */
.${commentStyles.attachmentContainer} {

    display: flex;
   font-family: Graphik, Graphik Compact, Arial, sans-serif;
    flex-direction: column;
}

/* Content styles for the second content area */
.${commentStyles.content2} {
    font-size: 1.67rem;
    font-weight: 400;
    line-height: 2rem;
    letter-spacing: 0.5px;
}




/* Pulsating circle styles */
.${commentStyles.pulsatingCircle} {
       width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    position: relative;
}


.${commentStyles.pulsatingCircle}::before {
        content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.2em;
    height: 0.2em;
    border-radius: 50%;
    background-color: #333;
    transform: translate(-50%, -50%);
    z-index: 1;
}

.${commentStyles.pulsatingCircle}::after {
   content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: #333;
    opacity: 0.4;
    animation: pulse 2s infinite;
    transform: translate(-50%, -50%);
    z-index: 0;
}

@keyframes pulse {
    0% {
        transform: translate(-50%, -50%) scale(0.33);
        opacity: 0.4;
    }
    70% {
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.4;
    }
    100% {
        transform: translate(-50%, -50%) scale(0.33);
        opacity: 0.4;
    }
}

/* Mention styles */
.${commentStyles.mention} {
    font-weight: 500;
    font-family: 'Graphik', sans-serif;
    color: #2B70C2;
}

/* Pulse container styles */
.${commentStyles.pulseContainer} {
   display: flex;
    justify-content: start;
    align-items: center;
    gap: 1rem;
    margin-right: -5rem;
}

/* Notification message styles */
.${commentStyles.notificationMessage} {
       display: inline-flex;
    align-items: start;
    font-size: 0.7em;
    white-space: nowrap;
    margin-left: -0.75em;
    margin-right: -5em;
    color: #2B70C2;
}

/* Reply add container styles */
.${commentStyles.replyAddContainer} {
     display: flex;
    margin-top: 0.8em;
    align-items: start;
    padding-left: 1.89em;

}

/* Reply avatar styles */
.${commentStyles.replyAvatar} {
    width: 30px;
    height: 30px;
    margin-right: 16px;
    margin-top: 12px;
    background-color: #220047;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Reply container styles */
.${commentStyles.replyContainer} {
   width: 100%;

    flex-direction: column;
    display: flex;
    align-items: start;
    padding-left: 5rem;
    flex-direction: column;
    display: flex;
    align-items: start;
    padding-left: 1.89em;
}

/* Show button styles */
.${commentStyles.showButton} {
        color: #2B70C2;
    display: flex !important;
    font-size: 0.6em !important;
    padding: 0.3;
    cursor: pointer;
    padding-top: 2em;
}


.${commentStyles.showButton}:hover {
          color: #2B70C2;
    display: flex !important;
    cursor: pointer;
}

.${commentStyles.showButton} svg {
     width: 1em;
    height: 1em;
    margin-left: 0.1em;
    cursor: pointer;
}


/* Cancel and proceed button styles */
.${commentStyles.cancel} {
       border-color: #220047;
    margin-right: 1em;
    font-weight: 700;
    background: white;
    color: #220047;
    border: 1px solid #22004799;
    padding: 5px 15px;
    font-size: 0.7em;
    padding-left: em;
    cursor: pointer;
    height: 2em;
    border-radius: 2px;
}


.${commentStyles.menu} {
position: absolute;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    margin-left: 13em;
    /* margin-left: 34rem; */
    display: grid;
        height: 3.56em;
    min-height:3.56em;
    padding: 0rem !important;
}

.${commentStyles.menuItem} {
 
cursor: pointer;
    background: none;
    border: none;
    text-align: left;
    font-size: 0.7em;
    color: #220047;
}

.${commentStyles.menuItem}:hover {
background: #00000012;
}
.${commentStyles.menuItem}:disabled {
    
    opacity: 0.5; 
    color: rgba(34, 0, 71, 0.5); 
    pointer-events: none;
   
}

.${commentStyles.dialogTitle} {
    display: flex;
    font-family: 'Graphik Compact', sans-serif;
    align-items: center;
    font-size: 0.7em;
    padding-top: 3em;
    margin-bottom: 4em;
    gap: 1rem;
}
/* Dialog root styles */
.${commentStyles.dialogRoot} {
   display: flex;
    margin-left: 0m;
    padding-top: 1.6em;
    padding-left: 0;
    border-bottom: 1px solid #BF99BD;
    padding-right: 0;
    margin-top: -5em;
    height: 60%;
    padding-bottom: -3em;
    justify-content: space-between;
}



   

.${commentStyles.cancel}:hover {
   opacity: 0.75;
box-shadow: 1px 1px 4px 0px #220047;
background-color: transparent;   
}
.${commentStyles.proceed}:hover {
box-shadow: 1px 1px 4px 0px #220047;
 }






.${commentStyles.dialogPaper} {
        background: white;
    padding: 1rem;
    width: 25%;
    box-shadow: 0 24px 38px rgba(0, 0, 0, 0.14), 0 9px 46px rgba(0, 0, 0, 0.12), 0 11px 15px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(2rem);
    height: 160px;
    font-size: larger;
    margin-left: 4rem;
}





.${commentStyles.closeButton} {
     cursor: pointer;
    padding-top: 3.2em;
}
    
.${commentStyles.closeButton} :hover {
          cursor: pointer;
       background-color: #00000012;
    border-radius: 50%;
}


.${commentStyles.closeButton} svg {
  
   fill: #220047;
}
.${commentStyles.dialogContainer}
{
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
   }
.${commentStyles.dialogContent} {
   font-size: 0.7em;
    margin-bottom: 70px;
    color: #220047;
    margin-top: 1em;
    font-weight: 400;
    word-spacing: 2px;
}
  
.${commentStyles.dialogActions} {
   display: flex;
    justify-content: flex-end;
    border: none;
    margin-top: -0.4em;
}


.${commentStyles.proceed} {
        background: #220047;
    color: #FFA497;
  
    border-color: #220047;
    margin-right: 1em;
    font-weight: 700;
    border: 1px solid #22004799;
    padding: 5px 15px;
    font-size: 0.7em;
    cursor: pointer;
    height: 2em;
    border-radius: 2px;
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}


.${commentListStyles.scrollableContainer} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    overflow-y: auto; 
    overflow-x: hidden;
}
.${commentListStyles.commentContainer}{
width:100%;
}
.${commentListStyles.scrollableContainer}::-webkit-scrollbar {
    width: 5px !important; 
}

.${commentListStyles.scrollableContainer}::-webkit-scrollbar-track {
    background-color: transparent !important; 
}

.${commentListStyles.scrollableContainer}::-webkit-scrollbar-thumb {
    border-radius: 0.6rem;
    backdrop-filter: blur(0.5rem);
    border: 0.5px solid #220047CC; 
}
.${commentListStyles.scrollableContainer}::-webkit-scrollbar:horizontal {
    height: 0.4rem;
  }
.${commentStyles.bookmarkResolveContainer} {
           display: flex;
    justify-content: space-between;
    gap: 0.1em;
}




.${replyStyles.commentContainer} {
   display: flex;
    margin-top: 1em;
    align-items: start;
    flex-direction: column;
    width: 90%;
}

/* Header styles */
.${replyStyles.header} {
    display: flex;
    align-items: center;
}

/* Content styles */
.${replyStyles.content} {
   font-size: 0.8em;
    padding-left: 2.7em;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
}

/* Avatar styles */
.${replyStyles.avatar} {
   
    width: 30px;
    height: 30px;
    margin-right: 16px;
    color: white;
    font-family: inherit;
    border-radius: 50%;
    font-size: 0.7em;
    display: flex;
    align-items: center;
    justify-content: center;
}
    .${replyStyles.mention} {
     font-weight: 500;
    font-family: 'Graphik', sans-serif;
    color: #2B70C2;
}

/* Avatar wrapper styles */
.${replyStyles.avatarWrapper} {
          width: 2em;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;

}

/* Name styles */
.${replyStyles.name} {
       font-weight: 550;
    font-size: 10px;
    line-height: 1.5rem;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
}

/* Text field styles */
.${replyStyles.textField} {
    width: 100%;
    font-size: 0.8em;
}

  /* replyAddStyles */
.${replyAddStyles.commentContainer} {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 8px;
    color: #220047;
    width: 100%;
    padding-top: 2rem;
    margin-bottom: 0.8rem;
    padding-bottom: 0.8rem;
    margin-top: 2rem;
    align-items: start;
    padding-left: 5rem;
}

.${replyAddStyles.iconBar} {
    display: flex;
    gap: 1rem;
}

.${replyAddStyles.header} {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-right: 56px;
}

.${replyAddStyles.avatarWrapper} {
          width: 2em;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;

}
    
.${replyAddStyles.progress} {
    margin-left: 2em;
    font-size: 0.5em;
  }

.${replyAddStyles.avatar} {
 width: 30px;
    height: 30px;
    margin-right: 16px;
    background-color: #220047;
    color: white;
    font-family: inherit;
    border-radius: 50%;
    font-size: 0.7em;
    display: flex;
    align-items: center;
    justify-content: center;
}

.${replyAddStyles.content} {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    margin-left: -0.5rem;
}

.${replyAddStyles.name} {
   font-size: 0.65em;
    font-weight: 550;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
}

.${replyAddStyles.textField} {
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #220047;
    font-size: 0.8em;
    font-weight: 500; /* Color for the comment text */
}
.${replyAddStyles.commentBox} {
     margin-top: 0.2em;
   
   
    margin-bottom: 1em;
   
    border-radius: 3px;
    margin-left: 0.2em;
   
    width: 100%;
    padding: 0.1em;
    color: #989C9C;
    box-sizing: border-box;
    transition: border 0.3s, height 0.3s;
    height: 1.5em;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1.5px solid #A8AFB8;
    position: relative;
   
}

.${replyAddStyles.commentBoxFocused} {
  border: 1.5px solid #2B70C2;
    height: auto;
    min-height: 4em;
    border-radius: 3px;
}

.${replyAddStyles.textFieldWrapper} {
  flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}


.${replyStyles.mention} {
     font-weight: 500;
    font-family: 'Graphik', sans-serif;
    color: #2B70C2;
}


.${replyAddStyles.divider} {
    display: none;
    border-bottom: 1px solid #BF99BD;
       margin-top: 0.3em;
}

.${replyAddStyles.dividerFocused} {
    display: block;
    border-bottom: 1px solid #BF99BD;
 
}

.${replyAddStyles.actionButtons} {
    display: none;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
}

.${replyAddStyles.actionButtonsVisible} {
     display: flex;
    justify-content: space-between;
    align-items: center;
    height: 2em;
}

.${replyAddStyles.iconButton} {
       padding: 0.4em;
}

.${replyAddStyles.rotatedAttachIcon} {
         cursor: pointer;
    padding: 0.8rem;
    color: #220047;
}

.${replyAddStyles.rotatedAttachIcon} :hover {
        cursor: pointer;
    background-color: #00000012;
    border-radius: 50%;
   
}

.${replyAddStyles.sendButton} {
    cursor: pointer;
    padding: 0.5em;
}
    .${replyAddStyles.sendButton} :hover{
           cursor: pointer;
    background-color: #00000012;
    border-radius: 50%;
  }

.${replyAddStyles.attachmentContainer} {
         display: flex;
    flex-direction: column;
  
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
}

.${replyAddStyles.attachmentCard} {
display: flex;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 1em;
    border: none;
    background-color: #F9F8F8;
    border-radius: 2px;
    padding: 0.3rem;
    font-family: Graphik, Graphik Compact, Arial, sans-serif;
    position: relative;
    color: #220047;
}

.${replyAddStyles.fileIcon} {
   width: 0.7em;
    height: 0.7em;
}

.${replyAddStyles.fileName} {
       flex-grow: 1;
    margin-left: 1em;
    margin-right: 1em;
    white-space: nowrap;
    overflow: hidden;
    font-size: 0.5em;
    text-overflow: ellipsis;
    max-width: 50%;
}

.${replyAddStyles.fileSize} {
        margin-right: 0.8em;
    font-size: 0.5em
}

.${replyAddStyles.cancelIcon} {
         margin-left: 0.5rem;
    cursor: pointer;
    width: 0.7em;
    height: 0.7em;
    margin-left: em;
    margin-right: 1em;
    cursor: pointer;
}

.${replyAddStyles.downloadIcon} {
         width: 0.7em;
    height: 0.7em;
    cursor: pointer;
}

 .${replyAddStyles.loadingBarContainer} {
    position: relative;
    width: 100%;
    height: 2.7px;
    border-radius: 2px;
    overflow: hidden;
    margin-top: 1em;
    margin-left: -35em;
}
      
      .${replyAddStyles.loadingBar} {
       height: 100%;
    background-color: #220047;
    border-radius: 2px;
      }
      .${replyAddStyles.warningText} {
       margin-top: 0.1em;
    font-size: 0.5em;
    color: gray;
        padding-left: 0.3em;
          
    margin-bottom: 0.3em;
      }



.${customSnackbarStyles.customSnackbar}{
      background-color: #00A582;
    position: absolute;
    width: 90;
    border-radius: 0.2em;
    height: em;
    height: 2.2em;
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.5s ease-in-out;
    transform: translateX(20px);
}
  .${customSnackbarStyles.customSnackbarShow}{
     opacity: 1;
    transform: translateX(20px); 
  }

.${customSnackbarStyles.snackbarContent}{
    display: flex;
    align-items: center;
    width: 100%;
    gap: 24px;
}
.${customSnackbarStyles.snackbarIcon} {
    display: flex;
    fill: #ffffff;
    margin-left: 0.8rem;
    margin-top: 0.3em;
}
.${customSnackbarStyles.severityIcon}{
   
    fill: white;
    margin-top: 0.8rem;
    /* margin-bottom: 30px; */
    margin-left: 0.4rem;
    display:flex;
}

.${customSnackbarStyles.snackbarMessage} {
   color: #ffffff;
    display: flex;
    justify-content: start;
    margin-top: -1.5em;
    margin-left: 40px;
    font-size: 0.8em;
   
    
}

.${customSnackbarStyles.snackbarClose} {
      stroke: #ffffff;
    margin-top: -1em;
    margin-left: 15em;
    cursor: pointer;
    margin-right: 1em;
}



.${noCommentStyles.main}{
    margin-bottom: auto;
    margin-top: 50%;
    width: 100%; /* Assuming 'full' means full width */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    color: #220047; /* Replace with the appropriate color */
}

.${noCommentStyles.message}{
   font-size: 0.7em;
    letter-spacing: 0.5px;
    font-weight: 500;
    font-family: inherit;
}

.${customSnackbarStyles.blankIcon} svg {
    fill: #ffffff; /* Replace with the appropriate color */
}


    `;

    this.shadowRoot.appendChild(style);

    createRoot(container).render(
      <GlobalProvider initialState={globalState.getState()}>
        <AuthProvider>
          <CommentsDrawer open={true} onClose={() => { /* handle close */ }} filter_id={this._props.filter_id} />
        </AuthProvider>
      </GlobalProvider>
    );
  }
}

customElements.define('comments-drawer-element', CommentsDrawerElement);
