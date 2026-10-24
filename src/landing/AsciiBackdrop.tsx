import GradientASCII from './GradientASCII'

const ASCII_FONT = '"Timeless Sans", system-ui, sans-serif'

// the GradientASCII field used behind the V2 hero and the prompt section (HeroOrb.tsx stays in the code for another section)
export function AsciiBackdrop() {
  return (
    <div className="v2-ascii" aria-hidden="true">
      <GradientASCII
        colors={['#005656', '#36cc8b', '#d0f255']}
        shape="horizon"
        characters=" =+xX0S8#@"
        cellSize={14.4}
        density={0.7}
        glyphOpacity={0.8}
        gradientOpacity={0.45}
        fontFamily={ASCII_FONT}
        dpr={1}
      />
    </div>
  )
}
