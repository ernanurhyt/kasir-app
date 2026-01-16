import React from 'react'
import { Col,Card } from 'react-bootstrap'
import {numberWithCommas} from '../utils/utils'

const Menus = ({ menu, masukKeranjang }) => {
  return (

    <Col md={4} xs={6} className="mb-4">
      <Card className='shadow' onClick={() => masukKeranjang(menu)}>
        {/* {"category"+menu.category.nama.toLowerCase()}
        {"gambar"+menu.gambar} */}
        {/* <Card.Img variant="top" src={"assets/images/"+menu.category.nama.toLowerCase()+"/"+menu.gambar} /> */}
        <Card.Img variant="top" src={"assets/images/"+menu.Category.toLowerCase()+"/"+menu.Path_gambar} width="300" height="200"/>
        {/* <Card.Img variant="top" src={"assets/images/"+menu.category.nama.toLowerCase()+"/"+menu.gambar} style={{width: '300px', height: 'auto', maxWidth: '100%' }}/> */}
        <Card.Body>
          {/* <Card.Title>{menu.nama}<b>({menu.kode})</b></Card.Title> */}
          <Card.Title><b>{menu.Nama}</b></Card.Title>
          <Card.Text>
            Rp.{numberWithCommas(menu.Harga)}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default Menus