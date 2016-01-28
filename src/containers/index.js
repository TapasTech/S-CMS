import Base from './Base';
import Login from './Login/Login';
import Register from './Register/Register';
import Dashboard from './Dashboard/Dashboard';
import CreateOrg from './CreateOrg/CreateOrg';

import {SettingContainer} from './Settings/SettingContainer';
import ProductList from './Settings/Product/ProductList';
import ProductItem from './Settings/Product/ProductItem';
import Member from './Settings/Member/Member';
import Organization from './Settings/Organization/Organization';

import Overcoat from './Overcoat/Overcoat';
import Library from './Library';
import Draft from './Draft';
import Edit from './Edit';
import Distribution from './Distribution';

export default {
  Base,
  Login,
  Register,
  Dashboard,
  CreateOrg,
  Org: {
    Settings: {
      SettingContainer,
      ProductList,
      ProductItem,
      Member,
      Organization
    },
    Product: {
      Overcoat,
      Library,
      Draft,
      Edit,
      Distribution
    }
  }
};
