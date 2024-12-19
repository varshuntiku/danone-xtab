
import React, { useState, useContext, useEffect, useRef } from 'react';
import styles from './CommentsDrawer.module.css';
import CloseIcon from './assets/CloseIcon';
import FilterIcon from './assets/FilterIcon';
import ResetIcon from './assets/ResetIcon';
import CommentsAdd from './CommentsAdd';
import { AuthContext } from '../Context/AuthContext';
import CommentsList from './CommentsList';
import CustomSnackbar from './CustomSnackbar';
import NoComments from './NoComments';
import Loader from './assets/Loading';
import { useApiServices } from './services/comments';
import MenuLoader from './assets/MenuLoader';
import BellIcon from './assets/BellIcon';

const CustomMenu = ({ open, onClose, items, onReset, menuRef,timeoutRef, handleCheckboxChange ,loading}) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        timeoutRef.current = setTimeout(() => {
          onClose();
        }, 300);
      }


    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen, onClose]);




  return (
    <div className={styles.menuContainer}>
      {isOpen && (
        <div className={styles.menu}>
          <div className={styles.menuItems} >
            {items?.map((item, index) => (
              <div key={index}
                className={`${styles.menuItem}`}
                disabled={loading}
              >
                <input
                  type="checkbox"
                  id={`checkbox-${index}`}
                  className={styles.checkbox}
                  checked={item.checked}
                  onChange={(e) => handleCheckboxChange(e, index)}
                />

                {item.label}
              </div>
            ))}
          </div>
          <div className={styles.buttonDivider}></div>

          <button className={styles.resetButton} onClick={onReset} >
            {loading ? (
              <span className={styles.Menuprogress}>
                <MenuLoader
                  center
                  size={20}
                />
              </span>
            ) : null}

            <ResetIcon />
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

const CommentsDrawer = ({ open, onClose, filter_id }) => {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(null);
  const [unresolved, setUnresolved] = useState(null);
  const [filterCommentId, setfilterCommentId] = useState('');
  const [linkType,setLinkType]=useState('');
  const [bookmarked, setBookmarked] = useState(null);
  const [deleted, setDeleted] = useState(null);
  const timeoutRef = useRef(null);
  const menuRef = useRef(null);
  const [notificationsOpen,setNotificationsOpen] = useState(false)
  const [menuItems, setMenuItems] = useState([
    { label: 'Bookmarked', checked: false },
    { label: 'Resolved', checked: false },
    { label: 'Unresolved', checked: false },
    { label: 'Deleted', checked: false },
  ])
  const [snackbar, setSnackbar] = useState({ message: '', severity: '' });
  const filtersApplied = menuItems.some(item => item.checked);

  const { user, login, logout } = useContext(AuthContext);
  const { getComments, getFiltersById, getUsers } = useApiServices();
  useEffect(() => {
    let getCommentParams = {
      payload: {
        identifier: window.location.href,
        include_deleted: deleted,
        bookmarked: bookmarked,
        resolved: resolved,
        unresolved: unresolved
      }
    };
    // if user is defined, initiate comments fetching
    if(user)
    sendReq(getCommentParams);
  }, [resolved, unresolved, bookmarked, deleted,user]);

  const removeComment = (id, type) => {
    const newComments = comments.filter((item) => item?.id !== id);
    setComments(newComments);

  };

  useEffect(() => {
    if (filter_id !== undefined && user) {
      const getFilters = async () => {
        try {
          const resp = await getFiltersById(filter_id);

          if (resp && resp.comment) {
            setfilterCommentId(resp.comment);
          }
          if (resp && resp.linkType) {
            setLinkType(resp.linkType);
          }
        } catch (err) {
          console.error('Error fetching filters:', err);
        }
      };

      getFilters();
    }
  }, [filter_id, getFiltersById,user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersResponse = await getUsers();
      setUsers(usersResponse);
    } catch (error) {
      handleSnackbar('Error while fetching users', 'warning');
    }
    setLoading(false);
  };

  useEffect(() => {
    if(user)
    fetchUsers();
    return () => {
      onClose();
    };
  }, [user]);



  const sendReq = async (getCommentParams, from = 'default') => {
    try {
      setLoading(true);

      const data = await getComments(getCommentParams);
      const commentsArray = data['comments'];

      if (from === 'add') {
        setBookmarked(null);
        setDeleted(null);
        setResolved(null);
        setUnresolved(null);
        setComments(commentsArray);
      } else {
        setComments(commentsArray);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSnackbar({
        severity: 'warning',
        message: 'Error while fetching comments'
      });
    }
  };


  const refreshComments = (from = 'default') => {
    const includeDeleted = menuItems.find(item => item.label === 'Deleted')?.checked;
    const isBookmarked = menuItems.find(item => item.label === 'Bookmarked')?.checked;
    const isResolved = menuItems.find(item => item.label === 'Resolved')?.checked;
    const isUnresolved = menuItems.find(item => item.label === 'Unresolved')?.checked;


    let getCommentParams = {
      payload: {
        identifier: window.location.href,
        include_deleted: includeDeleted,
        bookmarked: from === 'reset' ? null : isBookmarked,
        resolved: from === 'reset' ? null : isResolved ? true : null,
        unresolved: from === 'reset' ? null : isUnresolved && !isResolved ? true : null
      }
    };

    sendReq(getCommentParams, from);
  };




  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(false);
    }
  }, [open]);





  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleFilterClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }
    setMenuOpen(prev => !prev);
  };

  const handleFilterClose = () => {
    setMenuOpen(false);
  };



  const handleReset = () => {
    const resetItems = menuItems.map(item => ({ ...item, checked: false }));
    setMenuItems(resetItems);
    setSelectedCount(0);

    setBookmarked(null);
    setResolved(null);
    setUnresolved(null);
    setDeleted(null);

    refreshComments('reset');
  };

  const handleCheckboxChange = (e, index) => {
    const updatedItems = [...menuItems];
    updatedItems[index].checked = !updatedItems[index].checked;


    if (updatedItems[index].label === 'Resolved' && updatedItems[index].checked) {
      const unresolvedIndex = updatedItems.findIndex(item => item.label === 'Unresolved');
      if (unresolvedIndex !== -1) updatedItems[unresolvedIndex].checked = false;
    } else if (updatedItems[index].label === 'Unresolved' && updatedItems[index].checked) {
      const resolvedIndex = updatedItems.findIndex(item => item.label === 'Resolved');
      if (resolvedIndex !== -1) updatedItems[resolvedIndex].checked = false;
    }
    setMenuItems(updatedItems);
    setBookmarked(updatedItems.find(item => item.label === 'Bookmarked')?.checked || null);
    setResolved(updatedItems.find(item => item.label === 'Resolved')?.checked || null);
    setUnresolved(updatedItems.find(item => item.label === 'Unresolved')?.checked || null);
    setDeleted(updatedItems.find(item => item.label === 'Deleted')?.checked || null);

    const selectedCount = updatedItems.filter(item => item.checked).length;
    setSelectedCount(selectedCount);

    refreshComments();
  };



  const handleSnackbar = (message, severity) => {
    setSnackbar({ message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ message: '', severity: '' });
  };

  const handleLogin = async () => {
    await login()
    // const token  =  await getMainToken()
  };

  const handleLogout = async () => {
    await logout()
  };


  return (
    <div className={`${styles.body} ${visible ? styles.bodyVisible : ''}`}>
      <div className={styles.titlePane} >
        <div className={styles.commentTitle}><span >Comments</span> {user ? <button onClick={handleLogout} className={styles.login}>Logout</button> : null}</div>
        <div className={styles.buttonContainer}>

          <div className={styles.filterButton} onClick={handleFilterClick} ref={menuRef} title='Filters'>
          <span title='filters'>
              <FilterIcon />
            </span>
            {selectedCount > 0 && (
              <span className={styles.badge}>{selectedCount}</span>
            )}
          </div>
          <div className={styles.filterButton} onClick={()=>setNotificationsOpen(true)} ref={menuRef} title='Filters'>
            <span title='notifications'>
              <BellIcon />
            </span>
            {notificationsOpen > 0 && (
              <div className={styles.notificationPreview}>Notification Preview</div>
            )}
          </div>
          <div className={styles.closeButton} onClick={handleClose} title='Close'>
            <span title='close'>
              <CloseIcon />
            </span>
          </div>
        </div>
      </div>
      {!user ? <div style={{ height: '100%', width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <button onClick={handleLogin} className={styles.login}>Login</button>
      </div> : null}

      {menuOpen && (
        <CustomMenu
          open={menuOpen}
          onClose={handleFilterClose}
          handleCheckboxChange={handleCheckboxChange}
          setSelectedCount={setSelectedCount}
          items={menuItems}
          onReset={handleReset}
          setMenuItems={setMenuItems}
          menuRef={menuRef}
          timeoutRef={timeoutRef}
          loading={loading}
        />
      )}

      {user && <>
        <div className={styles.addCommentContainer}>
          <span>Add comment</span>
          <CommentsAdd refreshComments={refreshComments} handleSnackbar={handleSnackbar} users={users} />
        </div>
        {loading ? <span className={styles.progress}> <Loader center size={60} />  </span> : null}

        {comments?.length ? (
          <CommentsList
            users={users}
            comments={comments}
            onRemoveComment={removeComment}
            refreshComments={refreshComments}
            handleSnackbar={handleSnackbar}
            filterCommentId={filterCommentId}
            linkType={linkType}
          />
        ) : null}
        {!comments?.length && !loading ? <NoComments filtersApplied={filtersApplied} /> : null}
        {snackbar?.message?.length > 0 && (
          <CustomSnackbar
            message={snackbar.message}
            severity={snackbar.severity}
            onClose={handleSnackbarClose}
          />
        )}
      </>}
    </div>
  );
};

export default CommentsDrawer;

