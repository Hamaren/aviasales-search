import React, {Component} from 'react';
import './App.scss';

class InputGroup extends Component{
  constructor(props){
    super(props)
  }

  render(){
    const filter = this.props.filter;
    return(
      <div className={filter.status ? 'Filter__group group-checked' : 'Filter__group'}>
        <input className="Filter__input" type="checkbox" index={this.props.index} checked={filter.status} />
        <label className="Filter__label">{filter.text}</label>
      </div>
    )
  }
}

export default InputGroup;
