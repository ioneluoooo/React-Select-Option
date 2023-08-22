import { useEffect, useRef, useState } from "react"
import { styled } from "styled-components"

export type SelectOptions = {
    label: string;
    value: string | number;
};

type MultipleSelectProps = {
    multiple: true;
    value: SelectOptions[];
    onChange: (value: SelectOptions[]) => void;
};

type SingleSelectProps = {
    multiple?: false;
    value?: SelectOptions;
    onChange: (value: SelectOptions | undefined) => void;
};

type SelectProps = {
    options: SelectOptions[]
} & (SingleSelectProps | MultipleSelectProps);

function Select({ multiple, value, onChange, options }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    function clearOptions() {
        multiple ? onChange([]) : onChange(undefined)
    }
    function selectOptions(options: SelectOptions) {
        if (multiple) {
            if (value.includes(options)) {
                onChange(value.filter(o => o !== options))
            } else {
                onChange([...value, options])
            }
        } else { //if we already selected this option before
            //and re-select it,it will remove from the list
            if (options !== value) onChange(options)
        }


    }
    function isOptionSelected(options: SelectOptions) {
        return multiple ? value.includes(options) : options === value
        // If multiple is true:
        // value.includes(options): This checks if the options object is included in the value array. If it is included, it means the option is selected.
        // If multiple is false:
        // options === value: This checks if the options object is equal to the value object. If they are equal, it means the option is selected.
    }
    useEffect(() => {
        if (isOpen) setHighlightedIndex(0)
    }, [isOpen])
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return
            switch (e.code) {
                case 'Enter':
                case 'Space':
                    setIsOpen(prev => !prev)
                    if (isOpen) selectOptions(options[highlightedIndex])
                    break
                case 'ArrowUp':
                case 'ArrowDown':{
                    if (!isOpen) {
                        setIsOpen(true)
                        break
                    }
                    const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue) // to not get past the final option,to not overflow
                    }
                    break
                }
                case 'Escape':
                    setIsOpen(false)
                    break
            }

        }

        containerRef.current?.addEventListener('keydown', handler)
        return () => {
            containerRef.current?.removeEventListener('keydown', handler)
        }

    }, [isOpen, highlightedIndex])



    return ( // tabIndex specify the order in which elements receive focus 
        <Container
            ref={containerRef}
            onBlur={() => setIsOpen(false)}// click off the element it closes
            onClick={() => setIsOpen(prev => !prev)} tabIndex={0} >
            <Values>
                {multiple ? value.map(v => (
                    <CloseBtn key={v.value} onClick={e => {
                        e.stopPropagation()
                        selectOptions(v)
                    }}>{v.label}
                        <RemoveBtn>&times;</RemoveBtn>
                    </CloseBtn>
                )) : value?.label}
            </Values>
            <ClearButton onClick={e => {
                e.stopPropagation()//only to clear things
                // to not open our select element by default
                clearOptions()
            }}>&times;</ClearButton>
            <Divider></Divider>
            <Caret></Caret>
            <Options className={isOpen ? 'show' : ''}>
                {options.map((options, index) => (
                    <Option onClick={e => {
                        e.stopPropagation()
                        selectOptions(options)
                        setIsOpen(false)

                    }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        key={options.value}
                        className={`${isOptionSelected(options) ? 'selected' : ''
                            } ${index === highlightedIndex ? 'highlighted' : ""
                            }`}

                    >{options.label}
                    </Option>
                    // key prop is keeping track of the individual elements
                    //map iterates each element in the array in an JSX element

                ))}

            </Options>


        </Container>
    )
}

export default Select;
//em bases on the font-size,if font-size increases,em will too
const Container = styled.div`
  position: relative;
  width: 20em;
  min-height: 1.5em;
  border: 0.05em solid #777;
  display: flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.5em;
  border-radius: 0.25em;
  outline: none;
  
  &:focus {
    border-color: hsl(200, 100%, 50%);
  }
`;
const Values = styled.span`
flex-grow : 1; //moves everything else to the right as possible
display:flex;
gap:.5em;
flex-wrap:wrap;

`
const ClearButton = styled.button`
background:none;
color:#777;
border:none;
outline:none;
cursor:pointer;
padding: 0;
font-size: 1.25em;

&:focus,&:hover{
color:#333;
}

`
const Divider = styled.div`
background-color: #777;
align-self:stretch;
width:.05em;

`
const Caret = styled.button`
border:.25em solid transparent;
border-top : #777;
translate : 0 25%;
cursor:pointer;
`
const Options = styled.ul`
position : absolute;
margin : 0;
padding : 0;
list-style: none;
display: none;
max-height: 15em;
overflow-y: auto;
border : .05em solid #777;
border-radius :.25em;
width : 100%;
left:0;
top : calc(100% + .25em);
baackground-color:white;
z-index:100;
&.show{
    display:block;
}
`
const Option = styled.li`
  padding: 0.25em 0.5em;
  cursor: pointer;

  &.selected {
    background-color: hsl(200, 100%, 70%);
  }


  &.highlighted {
    background-color: hsl(200, 100%, 50%);
    color: white;
  }

  
`;
const CloseBtn = styled.button`
display:flex;
align-items:center;
border: .05em solid #777;
border-radius: .25em;
padding : .15em .25em;
gap:.25em;
cursor:pointer;
background:none;
outline:none;

&:hover,&:focus{
background-color: hsl(0, 100%, 90%);
border-color : hsl(0, 100%, 50%);
}
`
const RemoveBtn = styled.span`
 &:hover,&:focus {
    color : hsl(0, 100%, 50%);
 }
`
