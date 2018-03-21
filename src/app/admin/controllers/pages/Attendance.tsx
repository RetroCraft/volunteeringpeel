// Library Imports
import { LocationDescriptor } from 'history';
import { connect, Dispatch } from 'react-redux';
import { withRouter } from 'react-router';
import { push } from 'react-router-redux';

// App Imports
import { loading } from '@app/common/actions';

// Component Imports
import Attendance from '@app/admin/components/pages/Attendance';
import { loadUser } from '@app/common/utilities';

const mapDispatchToProps = (dispatch: Dispatch<State>) => ({
  loading: (status: boolean) => dispatch(loading(status)),
});

const connectedAttendance = connect(null, mapDispatchToProps)(Attendance);

export default connectedAttendance;