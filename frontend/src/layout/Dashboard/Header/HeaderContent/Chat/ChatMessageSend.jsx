import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// material-ui
// ClickAwayListener and Popper removed as emoji-picker is not used
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// third-party

// project imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';

import { openSnackbar } from 'api/snackbar';
import { insertChat, useGetUsers } from 'api/chat';
import incrementer from 'utils/incrementer';

// assets
import PaperClipOutlined from '@ant-design/icons/PaperClipOutlined';
import PictureOutlined from '@ant-design/icons/PictureOutlined';
import SendOutlined from '@ant-design/icons/SendOutlined';
import SmileOutlined from '@ant-design/icons/SmileOutlined';
import SoundOutlined from '@ant-design/icons/SoundOutlined';

// ==============================|| CHAT - MESSAGE SEND ||============================== //

export default function ChatMessageSend({ user }) {
  const { users } = useGetUsers();

  const handleOnEmojiButtonClick = () => setMessage((msg) => msg + '😊');

  // handle new message form
  const [message, setMessage] = useState('');
  const textInput = useRef(null);

  const handleOnSend = () => {
    if (message.trim() === '') {
      openSnackbar({
        open: true,
        message: 'Message required',
        variant: 'alert',

        alert: {
          color: 'error'
        }
      });
    } else {
      const d = new Date();
      const newMessage = {
        id: Number(incrementer(users.length)),
        from: 'User1',
        to: user.name,
        text: message,
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      insertChat(user.name, newMessage);
    }
    setMessage('');
  };

  const handleEnter = (event) => {
    if (event?.key !== 'Enter') {
      return;
    }
    handleOnSend();
  };

  // handle emoji - simplified without external library

  return (
    <Stack sx={{ px: 2, pt: 3, borderTop: '1px solid', borderTopColor: 'divider' }}>
      <TextField
        inputRef={textInput}
        fullWidth
        multiline
        rows={4}
        placeholder="Your Message..."
        value={message}
        onChange={(e) => setMessage(e.target.value.length <= 1 ? e.target.value.trim() : e.target.value)}
        onKeyDown={handleEnter}
        variant="standard"
        slotProps={{ input: { sx: { '&:before': { borderBottomColor: 'divider' } } } }}
      />
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ py: 2, ml: -1 }}>
          <>
            <IconButton onClick={handleOnEmojiButtonClick} sx={{ opacity: 0.5 }} size="medium" color="secondary">
              <SmileOutlined />
            </IconButton>
          </>
          <IconButton sx={{ opacity: 0.5 }} size="medium" color="secondary">
            <PaperClipOutlined />
          </IconButton>
          <IconButton sx={{ opacity: 0.5 }} size="medium" color="secondary">
            <PictureOutlined />
          </IconButton>
          <IconButton sx={{ opacity: 0.5 }} size="medium" color="secondary">
            <SoundOutlined />
          </IconButton>
        </Stack>
        <IconButton color="primary" onClick={handleOnSend} size="large">
          <SendOutlined />
        </IconButton>
      </Stack>
    </Stack>
  );
}

ChatMessageSend.propTypes = { user: PropTypes.any };
