import { useEffect, useState } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';

// project import
import ChatDrawer from 'sections/apps/chat/ChatDrawer';
import ChatHistory from 'sections/apps/chat/ChatHistory';
import UserDetails from 'sections/apps/chat/UserDetails';
import MainCard from 'components/MainCard';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| CHAT ||============================== //

export default function Chat() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { menuMaster } = useGetMenuMaster();

  const [user, setUser] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    setUser({});
    handlerDrawerOpen(menuMaster.isDashboardDrawerOpened);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserChange = () => {
    setUser({});
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <ChatDrawer openChatDrawer={menuMaster.isDashboardDrawerOpened} handleDrawerOpen={handlerDrawerOpen} setUser={setUser} />
      <MainCard
        content={false}
        sx={{
          bgcolor: 'transparent',
          borderRadius: { xs: 0, sm: 2 },
          transition: menuMaster.isDashboardDrawerOpened ? 'margin .25s' : 'none',
          borderLeft: '1px solid',
          borderColor: 'divider',
          ml: menuMaster.isDashboardDrawerOpened ? { xs: 0, lg: '320px' } : 0
        }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={7}
            xl={8}
            sx={{
              borderRight: { xs: 'none', sm: '1px solid' },
              borderColor: { xs: 'transparent', sm: 'divider' }
            }}
          >
            <ChatHistory user={user} data={data} />
          </Grid>
          <Grid item xs={12} md={5} xl={4} sx={{ borderLeft: { sm: 'none', md: '1px solid' }, borderColor: 'divider' }}>
            <UserDetails user={user} onClose={handleUserChange} data={data} setData={setData} />
          </Grid>
        </Grid>
      </MainCard>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={!menuMaster.isDashboardDrawerOpened && downLG}
        ModalProps={{ keepMounted: true }}
        onClose={() => handlerDrawerOpen(!menuMaster.isDashboardDrawerOpened)}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 320, sm: 360 }, borderRight: 'none' } }}
      >
        <ChatDrawer handleDrawerOpen={handlerDrawerOpen} setUser={setUser} />
      </Drawer>
    </Box>
  );
}
