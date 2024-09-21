// Composition.tsx
import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, Audio } from 'remotion';
import { Easing } from 'remotion';

const MyComposition = () => {
  const frame = useCurrentFrame();
  
  // Fade-out timing
  const totalDuration = 300; // Total duration in frames
  const fadeOutStart = totalDuration - 30; // Start fading out 1 second before the end

  // Animate the text entrance from off-screen to the center
  const translateY = interpolate(frame, [0, 30], [-100, 0], {
    easing: Easing.out(Easing.ease),
  });

  // Set the duration in frames for the text display
  const textDuration = 90; // 3 seconds at 30 fps

  // Pulsing effect for the image
  const pulseScale = spring({
    frame: frame - textDuration, // Start pulsing after text disappears
    fps: 30,
    config: {
      damping: 5,
      stiffness: 100,
      mass: 1,
    },
  });

  // Interpolating scale to create a pulse effect
  const scale = interpolate(pulseScale, [0, 1], [1, 1.1]); // Pulse from normal size to slightly larger

  // Fade out effect for the image
  const imageOpacity = interpolate(
    frame,
    [fadeOutStart, totalDuration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Fade out effect for the audio
  const audioVolume = interpolate(
    frame,
    [fadeOutStart, totalDuration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #1e3c72, #2a5298, #1e3c72)', // Gradient background
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Audio src={require('../public/sound.mp3')} startFrom={0} volume={audioVolume} />

      {/* Display centered text "I'm Jack Sparrow" for 3 seconds */}
      <Sequence from={0} durationInFrames={textDuration}>
        <div
          style={{
            fontSize: 50,
            color: 'white',
            transform: `translate(-50%, -50%) translateY(${translateY}px)`, // Combine transformations
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)', // Text shadow for readability
            position: 'absolute',
            top: '50%',
            left: '50%',
          }}
        >
          I'm Jack Sparrow
        </div>
      </Sequence>

      {/* Display Captain Jack Sparrow's image centered with pulsing effect */}
      <Sequence from={textDuration}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <img
            src={require('../public/jack-sparrow.png')} // Ensure image path is correct
            alt="Captain Jack Sparrow"
            style={{
              maxWidth: '60%', // Adjust size as needed
              height: 'auto',
              borderRadius: 10,
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)', // Shadow for depth
              transform: `scale(${scale})`, // Apply pulsing effect
              opacity: imageOpacity, // Apply fade-out effect
            }}
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

export default MyComposition;
