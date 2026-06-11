import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { SnackbarProvider } from '@/components/ui/Snackbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { CollaboratorLayout } from '@/components/layout/CollaboratorLayout'

const LoginPage     = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const Verify2FAPage = lazy(() => import('@/pages/Verify2FAPage').then(m => ({ default: m.Verify2FAPage })))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })))

const UsersPage    = lazy(() => import('@/pages/admin/Users').then(m => ({ default: m.UsersPage })))
const TrailsPage   = lazy(() => import('@/pages/admin/Trails').then(m => ({ default: m.TrailsPage })))
const ContentsPage = lazy(() => import('@/pages/admin/Contents').then(m => ({ default: m.ContentsPage })))
const QuizzesPage  = lazy(() => import('@/pages/admin/Quizzes').then(m => ({ default: m.QuizzesPage })))

const OnboardingHome         = lazy(() => import('@/pages/collaborator/Home').then(m => ({ default: m.OnboardingHome })))
const TrailPage              = lazy(() => import('@/pages/collaborator/Trail').then(m => ({ default: m.TrailPage })))
const ContentPage            = lazy(() => import('@/pages/collaborator/Content').then(m => ({ default: m.ContentPage })))
const LibraryPage            = lazy(() => import('@/pages/collaborator/Library').then(m => ({ default: m.LibraryPage })))
const LibraryContentViewer   = lazy(() => import('@/pages/collaborator/Library/ContentViewer').then(m => ({ default: m.LibraryContentViewer })))

const RegisterPage = lazy(() => import('@/pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ProfilePage  = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })))

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--color-green-500)] border-t-transparent animate-spin" />
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Públicas */}
              <Route path="/login"      element={<LoginPage />} />
              <Route path="/register"   element={<RegisterPage />} />
              <Route path="/verify-2fa" element={<Verify2FAPage />} />

              {/* Admin */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin"            element={<AdminDashboard />} />
                  <Route path="/admin/users"       element={<UsersPage />} />
                  <Route path="/admin/trails"      element={<TrailsPage />} />
                  <Route path="/admin/contents"    element={<ContentsPage />} />
                  <Route path="/admin/quizzes"     element={<QuizzesPage />} />
                  <Route path="/admin/library"     element={<LibraryPage />} />
                </Route>
                <Route path="/admin/library/:contentId" element={<LibraryContentViewer />} />
              </Route>

              {/* Colaborador + Admin (áreas compartilhadas) */}
              <Route element={<ProtectedRoute allowedRoles={['collaborator', 'admin']} />}>
                {/* Páginas com sidebar */}
                <Route element={<CollaboratorLayout />}>
                  <Route path="/onboarding"                element={<OnboardingHome />} />
                  <Route path="/onboarding/library"        element={<LibraryPage />} />
                </Route>
                {/* Páginas imersivas (full-page, sem sidebar) */}
                <Route path="/onboarding/trail/:trailId"                        element={<TrailPage />} />
                <Route path="/onboarding/trail/:trailId/content/:itemId"        element={<ContentPage />} />
                <Route path="/onboarding/library/:contentId"                    element={<LibraryContentViewer />} />
                <Route path="/profile"                                          element={<ProfilePage />} />
              </Route>

              <Route path="/"    element={<Navigate to="/login" replace />} />
              <Route path="*"    element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
