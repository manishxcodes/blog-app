import { NavigateFunction } from "react-router-dom";

export const navigateToSignup = (navigate: NavigateFunction) => {
    navigate('/signup')
}

export const navigateToSignin = (navigate: NavigateFunction) => {
    navigate('/signin')
}

export const navigateToMainPage = (navigate: NavigateFunction) => {
    navigate('/blogs')
}

export const navigateToBookmarks = (navigate: NavigateFunction) => {
    navigate('/bookmarks')
}

export const navigateToMyPosts = (navigate: NavigateFunction) => {
    navigate('/myposts')
}