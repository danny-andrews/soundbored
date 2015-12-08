import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Board from '../../components/board/board';
import * as BoardActions from '../../actions/board';

function mapStateToProps(state) {
  return {board: state.board};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(BoardActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
