import React, { useState, Fragment } from 'react';
import Loader from '../layout/Loader/Loader';
import MetaData from '../layout/MetaData';
import './AiDesign.css'
import './styles.css'
import { App as Canvas } from './Component/Canvas'
import { Overlay } from './Component/Overlay'
import { generateDesign } from '../../actions/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextareaAutosize } from '@material-ui/core';
import { Link } from "react-router-dom";

const AiDesign = () => {
    const dispatch = useDispatch();
    const [prompts, setPrompts] = useState('');
    const [loading, setLoading] = useState(false);


    const handleInputChange = (e) => {
        setPrompts(e.target.value);
    };

    const { imageUrl } = useSelector((state) => state.generateDesign);

    const handleGenerateDesign = async () => {
        setLoading(true);
        try {
            await dispatch(generateDesign(prompts));
        } catch (error) {
            console.error('Error generating design:', error);
        } finally {
            setLoading(false);
        }
    };

    // const overlayDesignOnTshirt = (designUrl) => {
    //     const tshirtImg = document.querySelector('.tshirt-image img:first-child');
    //     const designImg = document.querySelector('.tshirt-image img:last-child');
    //     const centerX = (tshirtImg.width - designImg.width) / 2;
    //     const centerY = (tshirtImg.height - designImg.height) / 2;

    //     designImg.style.position = 'absolute';
    //     designImg.style.left = `${centerX}px`;
    //     designImg.style.top = `${centerY}px`;
    // };


    return (
        <Fragment>
            {loading ? (
                <Loader />
            ) : (
                <Fragment>
                    <MetaData title="AI -- Designer" />
                    <div className='center-div'>
                        <h2 className="aiDesignHeading">Get Your Own Design</h2>
                        <TextareaAutosize
                            minRows={4}
                            value={prompts}
                            onChange={handleInputChange}
                            placeholder="Enter prompts to describe the design you want..."
                            cols={50}
                            style={{
                                padding: 10
                            }}
                        ></TextareaAutosize>
                        <br />
                        <Button variant='contained' color='primary' onClick={handleGenerateDesign}>Generate Design</Button>
                        <br />
                    </div>
                    {/* <div className='tshirt-image'>
                        {!generatedDesign && (
                            <img src={generatedDesign} alt='Generated Design' className='overlay-design' width={150} />
                        )}
                    </div> */}
                    <>
                        {imageUrl && (
                            <>
                                <div className='image-threed'>
                                    <Canvas imageUrl={imageUrl} />
                                </div>
                                <Overlay />
                                <Link to={'/user/product'} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    textDecoration: 'none'
                                }}>
                                    <Button variant='contained' color='primary' >Add to cart</Button>
                                </Link>
                            </>
                        )}
                    </>

                </Fragment>
            )}
        </Fragment >
    );
};

export default AiDesign;
