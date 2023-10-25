import React from 'react'
import './About.css';
import boyPlayingKeyboard from './boyPlaying.png'
import image from './boyHeadset.png';
import aim from './aim.png';
import headset from './headsetCompressed_Transparent.png'
import warning from './warning.png'
import playlist from './playlist.png'
import { useNavigate } from 'react-router-dom';

function About() {

  const navigate = useNavigate();

  return (
    <div className='about'>
      <div className='about_first_section'>
        <div className='about_first_section_left'>
          <h1 className='about_heading'>MELODY MIX</h1><br></br>
          <h4 className='about_tagLine'>Where music is all about you</h4>
          <button onClick={() => {navigate('/')}} className='about_button'>Start Listening</button>
        </div>
        <div className='about_first_section_right'>
          <img src={image} />
        </div>
      </div>
      <div className='about_second_section'>
        <h1>Our Mission</h1>
        <div className='about_second_section_innerDiv'>
          <img src={aim} />
          <h4 className='second_h4'>At MELODY-MIX, we believe in putting the power of music back into <br/>
          the hands of the listeners. Our mission is simple: to create a seamless and ad-free music <br/>
          streaming experience that's tailored to your preferences. We are committed to making <br/> 
          your music journey enjoyable and personalized.
          </h4>
        </div>    
      </div>
      <div className='about_third_section'>
        <h1 className='about_third_section_heading'>What Sets Us Apart</h1>
        <div className='about_third_section_outerdiv'>
          <div className='about_third_section_innerdiv'>
            <img src={warning}/>
            <h2>Ad free</h2>
          </div>
          <div className='about_third_section_innerdiv'>
            <img className="playlist_image" src={playlist}/><div className='about_third_section_innerdiv'>
            <h2 className='playlist_tag'>Curated Playlist</h2>
            </div>
            <h2></h2>
          </div>
          <div className='about_third_section_innerdiv'>
            <img src={headset}/>
            <h2>Best Songs</h2>
          </div>
        </div>
      </div>
      <div className='about_fourth_section'>
        <h1>Join The Community</h1>
        <div className='about_fourth_section_outerdiv'>
          <div className='fourth_section_content'>
          <h4 className='fourth_h4'>We invite you to be a part of our growing community of music enthusiasts. It's time to <br/>
        enjoy music the way you want to, without interruptions. Explore, create, and share <br/>
        your musical journey with us.</h4>
        <button className='fourth_button' onClick={() => {navigate('/')}}>Join Now</button>
          </div>
          
        <img className='fourth_section_image' src={boyPlayingKeyboard}/>
        </div>
      </div>
      {/* <h1>About MELODY MIX</h1>
      <h3>Welcome to MELODY MIX, where music is all about you!<br/></h3>
      <br/><br/><br/>
      <h2>Our Mission</h2>
       <p>At MELODY-MIX, we believe in putting the power of music back into <br/>
        the hands of the listeners. Our mission is simple: to create a seamless and ad-free music <br/>
        streaming experience that's tailored to your preferences. We are committed to making <br/> 
        your music journey enjoyable and personalized.</p>
      <br/><br/><br/>
      <h2>What Sets Us Apart</h2>
        <p>Ad-Free Experience: Say goodbye to annoying ads that interrupt your music. We're <br/>
        dedicated to providing you with a completely ad-free environment, allowing you to<br/>
        immerse yourself in your favorite tunes without any distractions.</p>
        <br/>
        <p>User-Curated Playlists: You're in control. Create and <br/>
        manage your own playlists, and customize your music experience like never before. You can even upload your music, <br/>
        complete with song details and artwork, for a personalized touch.</p>
        <br/>
        <p>Playlists That Matter: Discover the music you love, save your favorite songs, and <br/> 
        create playlists tailored to your mood and preferences. Our Playlists page is your<br/>
        space to store your most-liked songs and explore curated collections.</p>
        <br/>
        <p>Personalized Profile: Your profile is your canvas. Edit it as you like, add your details, <br/>
        and make it uniquely yours. Showcase your favorite music, playlist collections, and <br/>
        more.</p>
        <br/><br/><br/>
        
        <h2>Join the MELODY MIX Community</h2>
        <p>We invite you to be a part of our growing community of music enthusiasts. It's time to <br/>
        enjoy music the way you want to, without interruptions. Explore, create, and share <br/>
        your musical journey with us.</p>
        <br/><br/><br/>
        
        <h2>Contact Us</h2>
        <p>Got questions, suggestions, or just want to say hello? We'd love to hear from you. Feel <br/>
        free to reach out to us anytime. Your feedback helps us improve your music <br/>experience.</p>

        Contact : <a href="mailto:vivekvenugopal513@gmail.com">vivekvenugopal513@gmail.com</a>
                  <a href="mailto:vyshnavsmenon62@gmail.com">vyshnavsmenon62@gmail.com</a>
        
        <br/><br/><br/>
        <h2>Stay Tuned</h2>
          <p>Stay updated on the latest features, music trends, and community news by <br/>
          subscribing to our newsletter. Let's celebrate the world of music together.</p>

        <br/><br/><br/>
        <h2>Let's Make Music Together</h2>
        <p>At MELODY MIX , we're passionate about music, and we're excited <br/>
        to have you as a part of our community. Join us in creating a music streaming platform <br/>
        that puts you first.
        <br/><br/>
        Ready to experience ad-free music like never before? <a href='/'>Get started</a></p> */}
    </div>
  )
}

export default About;
