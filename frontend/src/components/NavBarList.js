import List from '@mui/material/List'
import DashboardIcon from '@mui/icons-material/Dashboard';
import DataObjectIcon from '@mui/icons-material/DataObject';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import NavBarItem from './NavBarItem'
import useCookie from './useCookie';
import HistoryIcon from '@mui/icons-material/History';


const NavBarList = ({is_admin}) => {

  const {clearCookies} = useCookie();

  return <List>

      <NavBarItem
        text = "Questions"
        icon = {<DashboardIcon />}
        href = "../questionpage"
      />
      <NavBarItem
        text = "Matching Service"
        icon = {<PersonSearchIcon />}
        href = "../match"
      />
      <NavBarItem
        text = "User Profile"
        icon = {<PersonIcon />}
        href = "../profile"
      />

      <NavBarItem
        text = "Questions History"
        icon = {<HistoryIcon />}
        href = "../questionhistory"
      />

      {
        is_admin &&
        <NavBarItem
        text = "Admin View"
        icon = {<DataObjectIcon />}
        href = "../adminview"
      />
      }

      <NavBarItem
        text = "Log Out"
        icon = {<LogoutIcon />}
        href = "../"
        onClick={clearCookies}
      />
  </List>;
}

export default NavBarList;

