/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from 'react';
import { Button, Form, Container, Jumbotron, Table, Row } from 'react-bootstrap';
import { AgChartsReact } from 'ag-charts-react';
import * as agCharts from 'ag-charts-community';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';


let table=[]
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
  
      balance: 0,
      amount: '',
      errorMessage: '',
      transactionList: [],
      transDate: new Date(),
      options: {
        title: { text: "Basic Expense Tracker" },
        subtitle: { text: 'in Indian Rupee' },
        data: [],
        series: [
          {
            type: 'column',
            xKey: 'date',
            yKeys: ['income', 'expense'],
            yNames: ['Income', 'Expense',],
            grouped: true,
          },
        ],
      },   
     rowData:[]
    }
  }

 
  // assign value to state variable using name
  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };
  // adding amount to balance 
  handleNetincome = (flag) => {
   // e.preventDefault()
   
    const { balance, amount, transactionList, transDate } = this.state;
    const currentDate = (new Date(transDate)).toLocaleDateString('en-GB', { year: 'numeric', day: '2-digit', month: '2-digit'})
      .toString();
    if (amount !== '') {

      if (flag === 'income') {
        const newAmount = (Number(balance) + Number(amount))

        this.setState({
          balance: newAmount
        });

        transactionList.push({ transaction: amount, date: currentDate, type: 'Income' })
        table.push({ transaction: amount, date: currentDate, type: 'Income' })

      } else if (flag === 'expense') {
        const newAmount = (Number(balance) - Number(amount))
        this.setState({
          balance: newAmount
        });
        transactionList.push({ transaction: amount, date: currentDate, type: 'Expense' })
        table.push({ transaction: amount, date: currentDate, type: 'Expense' })

      }
   this.setState({
    rowData:table
   })
   

// grouping based on date
      const groups = transactionList.reduce(function (r, o) {
        const m = o.date.split(',')[0];

        r[m] ? r[m].data.push(o) : (r[m] = { group: String(m), data: [o] });
        return r;
      }, {});

      const result = Object.keys(groups).map(function (k) {
        return groups[k];
      });

     // aggregate income and expense based on date
      let arr = []
      result.forEach(element => {
        let add = 0;
        let sub = 0;
        element.data.forEach(i => {
          if (i.type === 'Income') {
            add += Number(i.transaction)
            } else {
            sub += Number(i.transaction)  
          }

        })

        arr.push({ date: element.group, income: add, expense: sub })
      });
      this.state.options.data = arr
    
    } else {
      this.setState({
        errorMessage: 'Please Enter Amount'
      })
    }

    setTimeout(() => {
      this.setState({
        errorMessage: ''
      })
    }, 3000);

  };
 
  render() {
      const {rowData, balance, amount, errorMessage, transDate} = this.state;  
  
      return (
      <div>
        <Container bsPrefaix="nc" >

          {/* form part */}

          <Jumbotron className="mt-5 w-100">

            <h4 className="d-flex justify-content-center"> Basic Expense Tracker</h4>
            <form>
              <Row className="w-100 ">
                <Row className="w-100  justify-content-center">
                  <Form.Group controlId="formBasicEmail " className="w-25">
                    <h6 className="d-flex justify-content-center mt-2" >Balance : {balance}</h6>
                    <h6 style={{ color: 'red' }} className="d-flex justify-content-center">{errorMessage}</h6>

                    <Form.Control type="number" required placeholder="Amount" name="amount" min="0" value={amount} onChange={this.handleChange}
                    />


                    <DatePicker placeholderText="Select Date" required clearButtonTitle="clear" selected={transDate} onChange={(date) => this.setState({ transDate: date })} className="mt-2" dateFormat="dd-MM-yyyy" maxDate={new Date()} minDate={new Date(new Date().setDate(new Date().getDate() - 60))} />
                  </Form.Group>
                </Row>
                <Row className="w-100  justify-content-center">

                  <Button
                    variant="success"
                    type="submit"
                    className="mb-4"
                    onClick={(e) => {e.preventDefault();this.handleNetincome('income')}}
                  >
                    Income
			          	</Button>
                  <Button
                    variant="danger"
                    type="submit"
                    className="mb-4 ml-3"
                    onClick={(e) =>{e.preventDefault(); this.handleNetincome('expense')}}

                  >
                    Expense
			          	</Button>

                </Row>
              </Row>
            </form>
          </Jumbotron>
          <Jumbotron className="mt-8 w-100">
          <AgChartsReact options={this.state.options} />
          </Jumbotron>
          {/* transaction list part */}
          <Jumbotron className="mt-8 w-100">
            
            <h4 className="">Transactions :</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Transaction Date</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {rowData.map((i) => (
                  <tr style={i.type === "Income" ? { color: 'green' } : { color: 'red' }} >
                    <td>{i.date}</td>
                    <td>₹{i.transaction}</td>
                    <td>{i.type}</td>
                  </tr>

                ))}

              </tbody>
            </Table>
           
          
          </Jumbotron>

        </Container>
      </div >
    );
  }
}

export default App;


