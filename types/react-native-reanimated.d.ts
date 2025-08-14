declare module 'react-native-reanimated' {
  export const Animated: any;
  export default Animated;
  export const FadeInDown: any;
  export const FadeInUp: any;
  export const SlideInUp: any;
  export const SlideInRight: any;
  
  export interface AnimateProps<T> {
    children?: React.ReactNode;
    entering?: any;
    style?: any;
    [key: string]: any;
  }
}