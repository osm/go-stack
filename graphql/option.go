package graphql

type Option func(*Server)

func WithResolver(resolver *Resolver) Option {
	return func(s *Server) {
		s.resolver = resolver
	}
}

func WithIntrospection() Option {
	return func(s *Server) {
		s.introspection = true
	}
}
