import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { numberWithCommas } from '../utils/utils';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export default class TotalBayar extends Component {
    submitTotalBayar = (totalBayar) => {
         if (this.props.namapemesan === "" || this.props.namapemesan === undefined){
            alert("Mohon Isi Nama")
        } else {
            const pesanan = {
                pemesan: this.props.namapemesan,
                total_bayar: totalBayar,
                menus: this.props.keranjangs
            }
            // alert("total bayar save to database")
            alert(JSON.stringify(pesanan))
             //SEND TO DB SUPABASE
            const url = "https://backend-production-49fd.up.railway.app/saveorder"
            axios
            .post(url,pesanan)// .post(API_URL+"pesanans",pesanan)
            .then((res) =>{
                this.props.history.push('/sukses')
            })
            localStorage.removeItem('keranjang');
        }
    
       
    }

    render() {

        const totalBayar = this.props.keranjangs.reduce(function (result, item) {
            return result + item.total_harga;
        }, 0);

        return (
            <>
            {/* web */}
            <div className='fixed-bottom d-none d-md-block' >
                <Row>
                    <Col md={{ span: 3, offset: 9 }} className='px-4 py-3 d-grid gap-2'>
                        <h4>Total Bayar : <strong className='float-right mr-2' >Rp.{numberWithCommas(totalBayar)}</strong></h4>
                        <Button 
                        variant='primary'
                        onClick={() => this.submitTotalBayar(totalBayar)}
                        >
                            <FontAwesomeIcon icon={faShoppingCart} /><strong>Buat Pesanan</strong>
                        </Button>
                    </Col>
                </Row>

            </div>

            {/* mobile */}
            <div className='d-sm-block d-md-none'>
                <Row>
                    <Col md={{ span: 3, offset: 9 }} className='px-4 py-3 d-grid gap-2'>
                        <h4>Total Harga : <strong className='float-right mr-2' >Rp.{numberWithCommas(totalBayar)}</strong></h4>
                        <Button 
                        variant='primary'
                        onClick={() => this.submitTotalBayar(totalBayar)}
                        >
                            <FontAwesomeIcon icon={faShoppingCart} /><strong>Buat Pesanan</strong>
                        </Button>
                    </Col>
                </Row>

            </div>
            </>
        )
    }
}

